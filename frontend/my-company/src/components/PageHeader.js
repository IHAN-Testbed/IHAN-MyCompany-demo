/** @jsx jsx */
import { Flex, Image, jsx } from 'theme-ui'
import { Heading, Text, Container } from 'components'
import personPlaceholder from 'assets/images/person-placeholder.jpg'
import Theme from 'theme'

const STYLE = {
  variant: ['flex.column', 'flex.rowCenter'],
  minHeight: ['10rem'],
  justifyContent: ['center', 'space-between'],
  mt: [5, 0],
}

const userProfileContainerSx = {
  m: 0,
  minWidth: ['17rem'],
  alignItems: 'center',
  justifyContent: [null, 'flex-end'],
  flex: ['40%'],
}

const imageSx = {
  ...Theme.transitions.onHover.brightness,
  borderRadius: 'pill',
  width: ['4rem', '6rem'],
  height: ['4rem', '6rem'],
  flexShrink: 0,
  border: 'border',
  objectFit: 'cover',
}

const userNameContainerSx = {
  variant: 'flex.column',
  fontSize: [5, 6, 7],
  mr: 4,
}

const pageTitleSx = {
  fontSize: [5, 6, 7],
  fontWeight: ['light'],
  my: [0],
}

export default ({ title, subtitle, userData = {}, csx }) => {
  return (
    <Flex className="page-header" sx={{ ...STYLE, ...csx }}>
      <Container
        csx={{
          flex: ['60%'],
        }}
      >
        <Heading csx={pageTitleSx}>{title || ''}</Heading>
        {subtitle && (
          <Text
            csx={{
              variant: 'text.mute',
              fontStyle: 'italic',
            }}
          >
            {subtitle}
          </Text>
        )}
      </Container>
      <Flex className="user-profile-container" sx={userProfileContainerSx}>
        <Flex sx={userNameContainerSx}>
          <Text csx={{ variant: 'text.bold' }}>{userData.name}</Text>
          <Text csx={{ variant: 'text.mute' }}>{userData.jobTitle}</Text>
        </Flex>

        <Image
          alt="User profile image"
          sx={imageSx}
          src={userData.image || personPlaceholder}
        />
      </Flex>
    </Flex>
  )
}
