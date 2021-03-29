import React from 'react'
import { LayoutRow } from 'components'
import { useParams } from 'react-router-dom'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import CompanyView from 'containers/CompanyView'
import BoardView from 'containers/BoardView'
import OwnershipView from 'containers/OwnershipView'
import CompanySearchView from 'containers/CompanySearchView'

function CompanyRouter({ userData, configuration = [] }) {
  const { businessId } = useParams()
  const company = configuration.companies.find((c) => c.businessId === businessId)

  let { path } = useRouteMatch()

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
          <CompanyView company={company} configuration={configuration} />
        </Route>
        <Route exact path={`${path}/board`}>
          <BoardView company={company} />
        </Route>
        <Route exact path={`${path}/ownership`}>
          <OwnershipView company={company} configuration={configuration} />
        </Route>
        <Route exact path={`${path}/company-search`}>
          <CompanySearchView />
        </Route>
      </Switch>
    </LayoutRow>
  )
}

export default CompanyRouter
