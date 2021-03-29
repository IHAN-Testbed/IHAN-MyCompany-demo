import React, { useState, useEffect } from 'react'
import { Message, Image, Spinner } from 'theme-ui'
import {
  CompanyBasicInfo,
  Container,
  Text,
  OwnershipDataTable,
  UserProfile,
  DataProduct,
} from 'components'
import { API } from 'utilities'

import person2Img from 'assets/images/demo-person/demo-3.jpg'

import myBisLogo from 'assets/images/mybis-dark-logo.svg'

const DATA_PRODUCTS = [
  {
    name: 'Business register extract',
    description: 'Finnish Patent and Registration Office',
    image: myBisLogo,
  },
  {
    name: 'List of shareholders',
    description: 'mybis register',
    image: myBisLogo,
  },
]

const USER_DATA = {
  name: 'James Jaatinen',
  jobTitle: 'Founder',
  image: person2Img,
}

const sharedConsentList = ['Business register extract', 'List of shareholders']

function CompanyView({ company = {}, userData = {} }) {
  const [basicCompanyInfoData, setBasicCompanyInfoData] = useState({
    basicInfo: {},
    isLoading: true,
    dataIsShared: false,
    error: '',
  })

  const [ownershipData, setOwnershipData] = useState({
    owners: [],
    shareSeries: [],
    isLoading: true,
    dataIsShared: false,
    error: '',
  })

  useEffect(() => {
    ;(async () => {
      const {
        ok,
        data: { data },
      } = await API.readConsent(company.id, userData.id)

      if (ok) {
        for (const consent of sharedConsentList) {
          switch (consent) {
            case 'Business register extract':
              setBasicCompanyInfoData({
                basicInfo: {},
                isLoading: !!data[consent],
                dataIsShared: !!data[consent],
                error: '',
              })

              if (data[consent]) {
                ;(async () => {
                  if (company.hasOwnProperty('businessId')) {
                    const { ok, data, error } = await API.getCompanyBasicInfo(
                      company.businessId
                    )
                    if (ok) {
                      setBasicCompanyInfoData({
                        basicInfo: { ...data, ...company.basicInfo },
                        error: '',
                        dataIsShared: true,
                        isLoading: false,
                      })
                    } else {
                      setBasicCompanyInfoData({
                        basicInfo: {},
                        error,
                        dataIsShared: true,
                        isLoading: false,
                      })
                    }
                  }
                })()
              }
              break

            case 'List of shareholders':
              setOwnershipData({
                owners: [],
                shareSeries: [],
                isLoading: !!data[consent],
                dataIsShared: !!data[consent],
                error: '',
              })

              if (data[consent]) {
                ;(async () => {
                  if (company.hasOwnProperty('businessId')) {
                    const { ok, data, error } = await API.getOwnershipData(
                      company.businessId
                    )
                    if (ok) {
                      setOwnershipData({
                        owners: data.owners,
                        shareSeries: data.shareSeries,
                        isLoading: false,
                        dataIsShared: true,
                        error: '',
                      })
                    } else {
                      setOwnershipData({
                        owners: [],
                        shareSeries: [],
                        isLoading: false,
                        dataIsShared: true,
                        error,
                      })
                    }
                  }
                })()
              }

              break
            default:
              break
          }
        }
      }
    })()
  }, [company, userData.id])

  const isLoading = basicCompanyInfoData.isLoading || ownershipData.isLoading
  const dataIsShared = basicCompanyInfoData.dataIsShared || ownershipData.dataIsShared

  return (
    <Container
      csx={{
        variant: ['flex.column', 'flex.column', 'flex.row'],
        flexWrap: 'wrap',
        justifyContent: [null, null, 'space-between'],
      }}
    >
      <Container
        csx={{
          variant: 'flex.columnCenterNoMargin',
          mb: [5],
          flex: '50%',
          justifyContent: 'start',
          alignItems: 'start',
          mr: [0, 4, 4],
          borderRight: ['none', 'none', 'menuItem'],
        }}
      >
        {!isLoading && !dataIsShared && (
          <Container>
            <Message sx={{ width: ['auto', 'auto', '50%'] }} variant="info">
              No data was shared yet
            </Message>
          </Container>
        )}

        {basicCompanyInfoData.dataIsShared && (
          <Container csx={{ mb: 5 }}>
            <Text csx={{ variant: 'text.sectionHeader' }}>BASIC INFO:</Text>
            {!basicCompanyInfoData.isLoading && (
              <CompanyBasicInfo basicInfo={basicCompanyInfoData.basicInfo} />
            )}

            {basicCompanyInfoData.isLoading && <Spinner sx={{ m: 3 }} />}
          </Container>
        )}

        {ownershipData.dataIsShared && (
          <Container>
            <Text csx={{ variant: 'text.sectionHeader' }}>OWNERSHIP DATA:</Text>
            {!ownershipData.isLoading && (
              <OwnershipDataTable ownershipData={ownershipData} />
            )}

            {ownershipData.isLoading && <Spinner sx={{ m: 3 }} />}
          </Container>
        )}
      </Container>

      {dataIsShared && (
        <Container
          csx={{
            variant: 'flex.columnCenterNoMargin',
            justifyContent: 'start',
            alignItems: 'start',
            mt: [5, 5, 0],
          }}
        >
          <Text csx={{ variant: 'text.sectionHeader' }}>DATA WAS SHARED BY:</Text>

          <Container csx={{ variant: 'flex.rowCenter' }}>
            <Image
              sx={{
                height: ['4rem'],
                pr: [4],
              }}
              alt={`Company logo ${company.id}`}
              src={company.image}
            />
            <UserProfile
              imageCsx={{ borderRadius: 'circle', border: 'none' }}
              baseProps={{ className: 'user-profile-shared' }}
              name={USER_DATA.name}
              image={USER_DATA.image}
              subTitle={USER_DATA.jobTitle}
            />
          </Container>

          <Text csx={{ variant: 'text.sectionHeader', mt: 5 }}>SHARED DATA:</Text>

          {basicCompanyInfoData.dataIsShared && (
            <DataProduct
              image={DATA_PRODUCTS[0].image}
              name={DATA_PRODUCTS[0].name}
              description={DATA_PRODUCTS[0].description}
            />
          )}
          {ownershipData.dataIsShared && (
            <DataProduct
              csx={{ my: 3 }}
              image={DATA_PRODUCTS[1].image}
              name={DATA_PRODUCTS[1].name}
              description={DATA_PRODUCTS[1].description}
            />
          )}
        </Container>
      )}
    </Container>
  )
}

export default CompanyView
