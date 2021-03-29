import React from 'react'
import { useHistory } from 'react-router-dom'
import { LayoutRow, CompanyCardHorizontal, Container, Heading } from 'components'

function CompanySelect({ userData, configuration = {} }) {
  const history = useHistory()

  const onCompanyClick = (businessId) => {
    history.push({
      pathname: `/company/${businessId}`,
    })
  }

  return (
    <LayoutRow
      headerTitle="Select company"
      userData={userData}
      activeMenuItem={'Select company'}
      id={'company-select-page'}
      hideMenu={true}
    >
      <Container csx={{ variant: 'flex.column' }}>
        {configuration.companies && (
          <Heading baseProps={{ as: 'h2' }}>
            You have access to {configuration.companies.length} companies:
          </Heading>
        )}

        {configuration.companies.map((c) => {
          return (
            <CompanyCardHorizontal
              onClick={onCompanyClick.bind(this, c.businessId)}
              key={c.id}
              company={c}
            />
          )
        })}
      </Container>
    </LayoutRow>
  )
}

export default CompanySelect
