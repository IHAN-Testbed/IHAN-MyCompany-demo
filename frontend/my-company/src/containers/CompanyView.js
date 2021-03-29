import React, { useState, useEffect } from 'react'
import { Spinner } from 'theme-ui'
import { CompanyBasicInfo, Container, Text, DataProduct, ShareModal } from 'components'
import { API } from 'utilities'

import myBisLogo from 'assets/images/mybis-dark-logo.svg'

const DATA_PRODUCTS = [
  {
    name: 'Business register extract',
    description: 'Finnish Patent and Registration Office',
    isForSharing: true,
    image: myBisLogo,
  },
  {
    name: 'Articles of Association',
    description: 'Finnish Patent and Registration Office',
    image: myBisLogo,
  },
  {
    name: 'Memorandum of Establishment',
    description: 'mybis register',
    image: myBisLogo,
  },
  {
    name: 'Company restrictions',
    description: 'mybis register',
    image: myBisLogo,
  },
]

function CompanyView({ company = {}, configuration = {} }) {
  const [basicCompanyInfoRequestData, setBasicCompanyInfoRequestData] = useState({
    isLoading: true,
  })

  const [dataProductToShare, setDataProductToShare] = useState({})

  const openModal = (dataProduct) => {
    setDataProductToShare(dataProduct)
  }

  const onModalCloseClick = () => {
    setDataProductToShare({})
  }

  useEffect(() => {
    ;(async () => {
      if (company.hasOwnProperty('businessId')) {
        const { ok, data, error } = await API.getCompanyBasicInfo(company.businessId)
        if (ok) {
          setBasicCompanyInfoRequestData({ basicInfo: data, isLoading: false })
        } else {
          setBasicCompanyInfoRequestData({ error, isLoading: false })
        }
      }
    })()
  }, [company])

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
          justifyContent: 'start',
          flex: '40%',
        }}
      >
        {basicCompanyInfoRequestData.basicInfo && (
          <CompanyBasicInfo
            basicInfo={{
              ...basicCompanyInfoRequestData.basicInfo,
              ...company.basicInfo,
            }}
          />
        )}
        {basicCompanyInfoRequestData.isLoading && <Spinner sx={{ m: 3 }} />}
      </Container>
      <Container
        csx={{
          variant: 'flex.columnCenterNoMargin',
          justifyContent: 'start',
          alignItems: 'start',
          mt: [5, 5, 0],
          flex: '0 0 23rem',
        }}
      >
        <Text csx={{ variant: 'text.sectionHeader' }}>DATA</Text>

        <Container csx={{ mt: [3] }}>
          {DATA_PRODUCTS.map((d) => {
            return (
              <DataProduct
                baseProps={{
                  onClick: d.isForSharing ? openModal.bind(this, d) : () => false,
                }}
                key={d.name}
                csx={{ my: 3 }}
                isForSharing={d.isForSharing}
                image={d.image}
                name={d.name}
                description={d.description}
              />
            )
          })}
        </Container>
      </Container>

      <ShareModal
        shareOptions={configuration.shareOptions}
        shareFrom={company.id}
        dataProduct={dataProductToShare}
        isOpen={dataProductToShare.hasOwnProperty('name')}
        onCloseClick={onModalCloseClick}
      />
    </Container>
  )
}

export default CompanyView
