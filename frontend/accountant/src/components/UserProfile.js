/** @jsx jsx */
import { jsx, Image } from 'theme-ui'
import { Container, Text } from 'components'
import personPlaceholder from '../assets/images/person-placeholder.jpg'
import Theme from 'theme'

const STYLE = {
  variant: 'flex.row',
  alignItems: 'center',
  justifyContent: [null, 'flex-end'],
}

const imageSx = {
  ...Theme.transitions.onHover.brightness,
  variant: 'flex.row',
  borderRadius: 'lg',
  width: ['4rem', '6rem'],
  height: ['4rem', '6rem'],
  flexShrink: 0,
  border: 'border',
  objectFit: 'cover',
}

const userNameContainerSx = {
  variant: 'flex.column',
  mr: 4,
}

export default ({ name, subTitle, image, baseProps = {}, imageCsx, csx }) => {
  return (
    <Container {...baseProps} csx={{ ...STYLE, ...csx }}>
      <Container csx={userNameContainerSx}>
        <Text csx={{ variant: 'text.bold' }}>{name}</Text>
        <Text csx={{ variant: 'text.mute' }}>{subTitle}</Text>
      </Container>

      <Image
        alt="User profile image"
        sx={{ ...imageSx, ...imageCsx }}
        src={image || personPlaceholder}
      />
    </Container>
  )
}
