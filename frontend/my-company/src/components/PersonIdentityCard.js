/** @jsx jsx */
import { Card, Image, Spinner, Flex, jsx } from 'theme-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { faTwitterSquare, faLinkedin } from '@fortawesome/free-brands-svg-icons'

import { Text, Container } from 'components'
import Theme from 'theme'

const STYLE = {
  ...Theme.transitions.onHover.default,
  width: ['10rem'],
  bg: 'white',
  borderRadius: 'xlg',
}

const imageSx = {
  maxWidth: ['80%'],
  borderRadius: 'circle',
  my: [3],
}

const cardContentSx = {
  variant: 'flex.columnCenter',
}

const textStyles = {
  title: {
    variant: 'text.notice',
    pt: [4],
    borderTop: 'menuItem',
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

export default ({ identity = {}, baseProps = {}, error = '', csx }) => {
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
      <Image
        sx={imageSx}
        alt={'Identity image for ' + identity.name}
        src={identity.data.image}
      />
      <Text csx={textStyles.title}>{identity.data.name}</Text>
      {identity.data.title && (
        <Text csx={textStyles.jobTitle}>{identity.data.title}</Text>
      )}

      <Container
        csx={{
          variant: 'flex.rowCenter',
          width: ['30%'],
          mt: 4,
          mb: 2,
        }}
      >
        {identity.data.socials.twitter && (
          <FontAwesomeIcon color="#1DA1F2" size="lg" icon={faTwitterSquare} />
        )}
        {identity.data.socials.linkedin && (
          <FontAwesomeIcon color="#2867B2" size="lg" sx={{ ml: 1 }} icon={faLinkedin} />
        )}
      </Container>
    </CardContentContainer>
  )

  return (
    <Card {...baseProps} className="identity-card" sx={{ ...STYLE, ...csx }}>
      {isLoading && getLoadingJsx(error)}
      {!isLoading && getIdentityContentJsx()}
    </Card>
  )
}
