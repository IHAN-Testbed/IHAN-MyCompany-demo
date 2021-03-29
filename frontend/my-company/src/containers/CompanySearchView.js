import React, { useState } from 'react'
import { CompanyBasicInfo, Container, Button, Text } from 'components'
import { API } from 'utilities'
import { Label, Input } from 'theme-ui'

const DEMO_DATA = {
  municipality: 'N/A',
  language: 'N/A',
  mainLine: 'N/A',
  postalAddress: 'N/A',
  streetAddress: 'N/A',
  www: 'N/A',
  mobilePhone: 'N/A',
}

function CompanySearchView() {
  const [basicCompanyInfoRequestData, setBasicCompanyInfoRequestData] = useState({})
  const [businessId, setBusinessId] = useState('')

  const onSearchComplete = (res) => {
    const { ok, data, error } = res
    if (ok) {
      setBasicCompanyInfoRequestData({ basicInfo: { ...data, ...DEMO_DATA } })
    } else {
      setBasicCompanyInfoRequestData({
        error: error[0]?.resp?.data.detail || 'Something went wrong, try again later',
      })
    }
    setBusinessId('')
  }

  return (
    <Container csx={{ variant: 'flex.column' }}>
      <form>
        <Container
          csx={{
            variant: 'flex.row',
            width: ['auto', '60%'],
            alignItems: 'center',
          }}
        >
          <Label sx={{ width: 'auto' }} htmlFor="Business ID">
            Business ID:
          </Label>
          <Input
            sx={{
              minWidth: ['50%'],
              maxWidth: ['90%', '60%'],
              ml: [3],
              mr: [5],
            }}
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value.trim())}
            name="businessId"
            id="businessId"
            placeholder="2464491-9"
          />
        </Container>

        <Button
          csx={{ mt: 3, flex: '30%', alignSelf: 'flex-start' }}
          isDisabled={businessId === ''}
          asyncOnClick={{
            asyncFn: API.getCompanyBasicInfo.bind(API, businessId),
            loadingText: 'Searching...',
            successText: 'Done!',
            failText: 'Failed!',
            resetStateTimeOut: 1000,
            onAsyncFinish: onSearchComplete,
          }}
        >
          Search
        </Button>
      </form>
      <Container csx={{ mt: 3 }}>
        <CompanyBasicInfo basicInfo={basicCompanyInfoRequestData.basicInfo} />
        {basicCompanyInfoRequestData.error && (
          <Text
            csx={{
              variant: 'text.error',
            }}
          >
            {basicCompanyInfoRequestData.error}
          </Text>
        )}
      </Container>
    </Container>
  )
}

export default CompanySearchView
