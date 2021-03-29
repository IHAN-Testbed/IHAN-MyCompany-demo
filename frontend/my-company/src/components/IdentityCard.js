/** @jsx jsx */
import { Card, Image, Spinner, Flex, jsx } from 'theme-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { Text, Container } from 'components'
import identityImg from 'assets/images/identity.svg'
import Theme from 'theme'

const STYLE = {
  ...Theme.transitions.onHover.default,
  width: ['10rem'],
  height: ['15rem'],
  bg: 'white',
}

const imageSx = {
  maxWidth: ['80%'],
  p: '3',
}

const cardContentSx = {
  variant: 'flex.columnCenter',
}

const textStyles = {
  title: {
    variant: 'text.notice',
    mt: [4],
  },
  idText: {
    variant: 'text.mute',
    mt: 4,
  },
  jobTitle: {
    variant: 'text.mute',
  },
}

const errorContainerSx = {
  variant: 'flex.columnCenter',
  svg: {
    color: 'danger',
  },
  '.error-text': {
    variant: 'text.notice',
    my: 3,
    textAlign: 'center',
  },
}

export default ({ identity = {}, baseProps = {}, error = '', icon, csx }) => {
  const isLoading = !identity.hasOwnProperty('data')

  const CardContentContainer = ({ children }) => (
    <Flex className="card-content-container" sx={cardContentSx}>
      {children}
    </Flex>
  )

  const getLoadingJsx = (error) => (
    <CardContentContainer>
      {error && (
        <Container csx={errorContainerSx}>
          <FontAwesomeIcon size="3x" className="button-icon" icon={faTimesCircle} />
          <Text
            baseProps={{
              className: 'error-text',
            }}
          >
            Couldn't load this identity.
          </Text>
        </Container>
      )}
      {!error && <Spinner sx={{ m: 5 }} />}
    </CardContentContainer>
  )

  const getIdentityContentJsx = () => (
    <CardContentContainer>
      {!icon && (
        <Image
          sx={imageSx}
          alt={'Identity image for ' + identity.name}
          src={identityImg}
        />
      )}
      {icon && <FontAwesomeIcon size="6x" icon={icon} />}
      <Text csx={textStyles.title}>{identity.data.name}</Text>
      {identity.data.title && (
        <Text csx={textStyles.jobTitle}>{identity.data.title}</Text>
      )}
    </CardContentContainer>
  )

  return (
    <Card {...baseProps} className="identity-card" sx={{ ...STYLE, ...csx }}>
      {isLoading && getLoadingJsx(error)}
      {!isLoading && getIdentityContentJsx()}
    </Card>
  )
}
