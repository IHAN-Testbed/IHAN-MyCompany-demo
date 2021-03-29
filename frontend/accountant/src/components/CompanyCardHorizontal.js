/** @jsx jsx */
import { Image, jsx } from 'theme-ui'
import { Container, Heading } from 'components'
import Theme from 'theme'

let style = {
  variant: 'flex.row',
  maxWidth: ['40rem'],
  bg: 'light',
  px: 4,
  py: 4,
  objectFit: 'contain',
  my: [2],
  alignItems: 'center',
  border: 'menuItem',
  justifyContent: 'space-between',
}

const imageSx = {
  width: ['30%'],
  minWidth: 'auto',
  pl: [4],
}

const contentContainerSx = {
  variant: 'flex.column',
  alignSelf: 'center',
}

export default ({ onClick, company, csx }) => {
  if (typeof onClick === 'function') {
    csx = {
      ...csx,
      ...Theme.transitions.onHover.default,
    }
  }

  return (
    <Container baseProps={{ onClick }} csx={{ ...style, ...csx }}>
      <Container csx={contentContainerSx}>
        <Heading baseProps={{ as: 'h1' }} csx={{ my: 0, color: 'indigo' }}>
          {company.name}
        </Heading>
      </Container>
      <Image
        sx={imageSx}
        alt={'Company logo ' + company.businessId}
        src={company.image}
      />
    </Container>
  )
}
