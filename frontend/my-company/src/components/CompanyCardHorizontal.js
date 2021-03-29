/** @jsx jsx */
import { Image, jsx } from 'theme-ui'
import { Container, Heading, Text } from 'components'
import Theme from 'theme'

let style = {
  variant: 'flex.row',
  maxWidth: ['30rem'],
  bg: 'dataProduct.bg',
  borderRadius: 'xlg',
  boxShadow: 'default',
  px: 3,
  py: 4,
  objectFit: 'contain',
  my: [2],
  alignItems: 'center',
}

const imageSx = {
  width: ['30%'],
  minWidth: 'auto',
  pr: [4],
  borderRight: 'menuItem',
}

const contentContainerSx = {
  variant: 'flex.column',
  ml: [3],
  alignSelf: 'start',
}

export default ({ onClick, company, csx }) => {
  if (typeof onClick === 'function') {
    style = {
      ...style,
      ...Theme.transitions.onHover.default,
    }
  }

  return (
    <Container baseProps={{ onClick }} csx={{ ...style, ...csx }}>
      <Image
        sx={imageSx}
        alt={'Company logo ' + company.businessId}
        src={company.image}
      />
      <Container csx={contentContainerSx}>
        <Heading baseProps={{ as: 'h2' }} csx={{ my: 0 }}>
          {company.name}
        </Heading>
        <Text csx={{ variant: 'text.mute' }}>{company.businessId}</Text>
      </Container>
    </Container>
  )
}
