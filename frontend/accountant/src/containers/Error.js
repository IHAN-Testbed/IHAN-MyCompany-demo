import React from 'react'
import { LayoutRow, Heading, Text, Link } from 'components'
import { Message } from 'theme-ui'
import { getUrlParams } from 'utilities'

function Error({ status = '404', error = 'This page does not exist.' }) {
  const { message, status_code } = getUrlParams(['message', 'status_code'])

  if (message) {
    error = message
  }

  if (status_code) {
    status = status_code
  }

  return (
    <LayoutRow hideMenu={true} hideHeader={true} id={`${status}-page`}>
      <Heading>Error {status} page</Heading>
      <Text
        csx={{
          mt: 3,
        }}
      >
        <Message sx={{ width: ['auto', 'auto', '50%'] }} variant="danger">
          {error}
        </Message>
        <Text csx={{ mt: [3, 4, 5] }}>
          Open <Link to={'/company-select'}>company select page</Link>
        </Text>
      </Text>
    </LayoutRow>
  )
}

export default Error
