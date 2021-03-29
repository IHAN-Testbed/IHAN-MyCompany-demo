import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import CompanyRouter from 'containers/CompanyRouter'
import Login from 'containers/Login'
import Error from 'containers/Error'
import CompanySelect from 'containers/CompanySelect'
import InitialLoading from 'containers/InitialLoading'

import { ProtectedRoute } from 'components'

import person1Img from 'assets/images/person-1.jpg'

import { API, getPublicUrl, getRandom } from 'utilities'

import { ThemeProvider } from 'theme-ui'
import theme from 'theme'

import aSturtupAbLogo from 'assets/images/a-company-logo.png'
import DLILogo from 'assets/images/dli-logo.png'

const companyMap = {
  '2464491-9': {
    name: 'Digital Living International Oy',
    image: DLILogo,
    companyForm: 'Limited company',
    basicInfo: {
      municipality: 'ESPOO',
      language: 'Finnish',
      mainLine: 'Computer programming activities (62010)',
      postalAddress: 'c/o James Jaatinen Fredrikinkatu 34 A 17 00100 HELSINKI',
      streetAddress: 'Fredrikinkatu 34 A 17 00100 HELSINKI',
      www: 'www.digitalliving.fi',
      mobilePhone: 'N/A',
    },
  },
}
const demoCompanies = [
  {
    name: 'Another Company Oy',
    image: aSturtupAbLogo,
    companyForm: 'Limited company',
  },
  {
    name: 'Next Company Oy',
    image: aSturtupAbLogo,
    companyForm: 'Limited company',
  },
]

function App() {
  const [userData, setUserData] = useState({})
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [configurationDataRequest, setConfigurationDataRequest] = useState({
    error: '',
    companies: [],
    shareOptions: [],
  })

  useEffect(() => {
    ;(async () => {
      const { ok, data } = await API.getUserData()

      if (ok) {
        // TODO: Demo grade
        // Construct userData with additional data for demo
        const avatars = [person1Img]

        // TODO: Demo grade
        let userData = {
          ...data,
          name: 'Minna Multanen',
          image: getRandom(avatars),
          jobTitle: 'Accountant',
        }

        ;(async () => {
          const { ok, data: configuration } = await API.getConfiguration()

          if (ok) {
            configuration.companies = configuration.companies.map((c) => {
              return {
                ...c,
                ...companyMap[c.businessId],
              }
            })

            configuration.companies = [...configuration.companies, ...demoCompanies]

            const accountantOption = configuration.shareOptions
              .find((s) => s.label === 'Person')
              .options.find((p) => p.label === userData.name)

            userData = {
              ...userData,
              sisuId: userData.id,
              id: accountantOption.value,
            }

            setUserData(userData)
            setConfigurationDataRequest({ ...configuration })
            setIsInitialLoading(false)
          } else {
            // setConfigurationDataRequest({ error: 'Something went wrong' })
          }
        })()
      } else {
        setIsInitialLoading(false)
      }
    })()
  }, [])

  let routes = <InitialLoading />

  if (!isInitialLoading) {
    routes = (
      <Switch>
        <Route exact path={['/', '/login']} component={Login} />

        <ProtectedRoute
          userData={userData}
          path="/company-select"
          route={
            <CompanySelect
              configuration={configurationDataRequest}
              userData={userData}
            />
          }
        />

        <ProtectedRoute
          userData={userData}
          exact={false}
          path="/company/:businessId"
          route={
            <CompanyRouter
              configuration={configurationDataRequest}
              userData={userData}
            />
          }
        />

        <Route component={Error} />
      </Switch>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Router basename={getPublicUrl()}>{routes}</Router>
    </ThemeProvider>
  )
}

export default App
