/** @jsx jsx */
import { jsx } from 'theme-ui'
import {
  Button,
  Container,
  Heading,
  Modal,
  Text,
  Select,
  DataProduct,
} from 'components'
import { API } from 'utilities'
import { useState } from 'react'

const errorTextSx = {
  variant: 'text.error',
  mt: 1,
}

const contentContainerSx = {
  mt: [4],
}

const selectContainerSx = {
  mt: [5],
  mb: [5],
}

export default ({
  isOpen,
  onCloseClick,
  shareFrom,
  dataProduct = {},
  shareOptions = {},
}) => {
  const [shareError, setShareError] = useState('')
  const [shareTo, setShareTo] = useState('')
  const [readConsentData, setReadConsentData] = useState({ data: { consent: false } })

  const onAfterClose = () => {
    setShareError('')
  }

  const checkIfShareable = async ({ value }) => {
    const { ok, data } = await API.readConsent(shareFrom, value)

    if (ok) {
      setReadConsentData(data)
      setShareTo(value)
    }
  }

  return (
    <Modal onCloseClick={onCloseClick} isOpen={isOpen} onAfterClose={onAfterClose}>
      <Container>
        <Heading>Sharing data</Heading>
        <Container csx={contentContainerSx}>
          <DataProduct
            image={dataProduct.image}
            name={dataProduct.name}
            description={dataProduct.description}
          />
          <Container csx={selectContainerSx}>
            <Text csx={{ variant: 'text.bold' }}>Who do you want to share with?</Text>
            <Select
              onChange={checkIfShareable}
              baseProps={{
                options: shareOptions,
              }}
            />
          </Container>
        </Container>
        {shareTo && !readConsentData.data[dataProduct.name] && (
          <Button
            asyncOnClick={{
              asyncFn: API.updateConsent.bind(
                API,
                shareFrom,
                shareTo,
                { ...readConsentData.data, [dataProduct.name]: true },
                {}
              ),
              loadingText: 'Sharing...',
              successText: 'Shared!',
              failText: 'Failed!',
              onAsyncFinish: () =>
                setTimeout(checkIfShareable.bind(this, { value: shareTo }), 1000),
            }}
            csx={{
              mr: 1,
            }}
          >
            Share consent
          </Button>
        )}

        {shareTo && readConsentData.data[dataProduct.name] && (
          <Button
            asyncOnClick={{
              asyncFn: API.updateConsent.bind(API, shareFrom, shareTo, {
                ...readConsentData.data,
                [dataProduct.name]: false,
              }),
              loadingText: 'Revoking...',
              successText: 'Revoked!',
              failText: 'Failed!',
              onAsyncFinish: () =>
                setTimeout(checkIfShareable.bind(this, { value: shareTo }), 1000),
            }}
            baseProps={{
              variant: 'danger',
            }}
          >
            Revoke consent
          </Button>
        )}

        <Text csx={errorTextSx}>{shareError}</Text>
      </Container>
    </Modal>
  )
}
