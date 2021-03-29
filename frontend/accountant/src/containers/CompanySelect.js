import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { LayoutRow, CompanyCardHorizontal, Container, Heading } from 'components'
import { API } from 'utilities'

function CompanySelect({ userData, configuration = {} }) {
  const history = useHistory()
  const [companiesProvidedConsent, setCompaniesProvidedConsent] = useState([])

  const onCompanyClick = (businessId) => {
    history.push({
      pathname: `/company/${businessId}`,
    })
  }

  useEffect(() => {
    ;(async () => {
      const companies = []

      for (const c of configuration.companies) {
        if (c.id) {
          const { ok, data } = await API.readConsent(c.id, userData.id)

          if (ok && data.data) {
            const consentData = data.data
            if (Object.keys(consentData).length) {
              for (const k of Object.keys(consentData)) {
                if (consentData[k]) {
                  c.consentData = consentData
                  companies.push(c)
                  break
                }
              }
            }
          }
        }
      }

      setCompaniesProvidedConsent(companies)
    })()
  }, [configuration.companies, userData.id])

  return (
    <LayoutRow
      headerTitle=""
      userData={userData}
      activeMenuItem={'Select company'}
      id={'company-select'}
      hideMenu={true}
    >
      <Heading baseProps={{ as: 'h2' }} csx={{ mb: 4 }}>
        Shared data with you ({companiesProvidedConsent.length}):
      </Heading>
      <Container csx={{ variant: 'flex.columnCenterNoMargin' }}>
        {companiesProvidedConsent.map((c) => {
          return (
            c.consentData && (
              <CompanyCardHorizontal
                onClick={onCompanyClick.bind(this, c.businessId)}
                key={c.id || c.name}
                company={c}
              />
            )
          )
        })}
      </Container>
      <Heading baseProps={{ as: 'h2' }} csx={{ mb: 4 }}>
        Waiting for data (
        {configuration.companies.length - companiesProvidedConsent.length}):
      </Heading>
      <Container csx={{ variant: 'flex.columnCenterNoMargin' }}>
        {configuration.companies.map((c) => {
          return (
            !c.consentData && (
              <CompanyCardHorizontal
                csx={{ opacity: 0.5 }}
                key={c.id || c.name}
                company={c}
              />
            )
          )
        })}
      </Container>
    </LayoutRow>
  )
}

export default CompanySelect
