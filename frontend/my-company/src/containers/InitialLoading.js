import React from 'react'
import { LayoutRow, Heading, Container } from 'components'
import { Spinner } from 'theme-ui'

function InitialLoading() {
  return (
    <LayoutRow
      hideHeader={true}
      hideMenu={true}
      includeOnly={['Log in']}
      id={'Loading state'}
    >
      <Container csx={{ variant: 'flex.columnCenter', mx: 'auto' }}>
        <Spinner sx={{ transform: 'scale(2)' }} />
        <Heading csx={{ mt: 6 }}>Loading...</Heading>
      </Container>
    </LayoutRow>
  )
}

export default InitialLoading
