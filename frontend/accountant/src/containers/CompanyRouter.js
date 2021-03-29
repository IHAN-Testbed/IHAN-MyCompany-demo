import React from 'react'
import { LayoutRow } from 'components'
import { useParams } from 'react-router-dom'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import CompanyView from 'containers/CompanyView'
import Error from 'containers/Error'

function CompanyRouter({ userData, configuration = [] }) {
  const { businessId } = useParams()
  let { path } = useRouteMatch()
  const company = configuration.companies.find((c) => c.businessId === businessId)

  if (typeof company === 'undefined') {
    return <Error />
  }

  return (
    <LayoutRow
      headerTitle={company.name}
      headerSubtitle={company.companyForm}
      companyLogo={company.image}
      userData={userData}
      id={'home-page'}
    >
      <Switch>
        <Route exact path={path}>
          <CompanyView
            company={company}
            configuration={configuration}
            userData={userData}
          />
        </Route>
      </Switch>
    </LayoutRow>
  )
}

export default CompanyRouter
