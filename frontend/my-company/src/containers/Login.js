import React, { useState } from 'react'
import { Image } from 'theme-ui'

import { API, getPublicUrl } from 'utilities'
import { LayoutRow, Button, Container, Text } from 'components'
import sisuIdLogo from 'assets/images/sisu-id.png'

const sisuIdLogoSx = {
  width: [200, null, null, 300],
}

const textContainerSx = {
  mt: 1,
  mb: 5,
  maxWidth: 'sm',
  textAlign: 'center',
}

const loginContentContainer = {
  variant: 'flex.columnCenter',
  m: '0 auto',
}

const errorTextSx = {
  variant: 'text.error',
  mt: 1,
}

function Login() {
  const [onLoginRequestData, setOnLoginRequestData] = useState({})

  const onLoginRequestFinish = (res) => {
    const { ok, data, status, error } = res
    if (ok) {
      window.location.href = data.redirectUri
    } else {
      if (status === 403) {
        window.location.href = getPublicUrl() + API.returnUrl
      } else {
        setOnLoginRequestData({ error: error })
      }
    }
  }

  return (
    <LayoutRow
      hideMenu={true}
      hideHeader={true}
      includeOnly={['Log in']}
      id={'login-page'}
    >
      <Container
        baseProps={{ className: 'login-content-container' }}
        csx={loginContentContainer}
      >
        <Image sx={sisuIdLogoSx} alt="SisuID logo" src={sisuIdLogo} />
        <Container csx={textContainerSx}>
          <Text>
            SisuID gives you a free and certified digital identity you can use to
            securely and easily connect to the digital society. It is based on Nordic
            values of equality, transparency, democracy and safety for every citizen.
          </Text>
        </Container>
        <Button
          fixedLoadingOnClick={true}
          isLoading={true}
          asyncOnClick={{
            asyncFn: API.startLogin.bind(API),
            onAsyncFinish: (res) => onLoginRequestFinish(res),
            loadingText: 'Logging in...',
            successText: 'Redirecting!',
            setErrorCb: (res, setError, setSuccess) => {
              if (res.status === 403) {
                setSuccess()
              } else {
                setError()
              }
            },
          }}
        >
          Log in
        </Button>
        <Text csx={errorTextSx}>{onLoginRequestData.error}</Text>
      </Container>
    </LayoutRow>
  )
}

export default Login
