/** @jsx jsx */
import { jsx, Spinner } from 'theme-ui'
import { useState, useEffect } from 'react'
import {
  Container,
  DataProduct,
  Text,
  ShareModal,
  OwnershipDataTable,
} from 'components'
import { API } from 'utilities'

import myBisLogo from 'assets/images/mybis-dark-logo.svg'

const DATA_PRODUCTS = [
  {
    name: 'Beneficial owners',
    description: 'Finnish Patent and Registration Office',
    image: myBisLogo,
  },
  {
    name: 'List of shareholders',
    description: 'mybis register',
    isForSharing: true,
    image: myBisLogo,
  },
]

function OwnershipView({ company = {}, configuration = {} }) {
  const [ownershipData, setOwnershipData] = useState({
    owners: [],
    shareSeries: [],
    isLoading: true,
    error: '',
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
        const { ok, data, error } = await API.getOwnershipData(company.businessId)
        if (ok) {
          setOwnershipData({
            owners: data.owners,
            shareSeries: data.shareSeries,
            error: '',
            isLoading: false,
          })
        } else {
          setOwnershipData({ owners: [], shareSeries: [], error, isLoading: false })
        }
      }
    })()
  }, [company])

  ownershipData.owners.forEach((o) => {
    o.totalShares = 0
    o.totalVotes = 0
    o.ownerships.forEach((os) => {
      o.totalShares += os.quantity

      const series = ownershipData.shareSeries.find(
        (ss) => ss.seriesName === os.seriesName
      )

      if (typeof series !== 'undefined') {
        o.totalVotes += os.quantity * series.votesPerShare
      }
    })
  })

  ownershipData.totalSharesAllSeries = 0
  ownershipData.totalVotesAllSeries = 0

  ownershipData.shareSeries.forEach((s) => {
    ownershipData.totalSharesAllSeries += s.totalShares
    ownershipData.totalVotesAllSeries += s.totalShares * s.votesPerShare
  })

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
        {ownershipData.isLoading && <Spinner sx={{ m: 3 }} />}
        {!ownershipData.isLoading && (
          <OwnershipDataTable ownershipData={ownershipData} />
        )}
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

export default OwnershipView
