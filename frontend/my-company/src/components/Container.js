/** @jsx jsx */
import { Container, jsx } from 'theme-ui'

const STYLE = {
  my: 0,
  mx: 0,
}

export default ({ children, baseProps = {}, csx }) => {
  return (
    <Container sx={{ ...STYLE, ...csx }} {...baseProps}>
      {children}
    </Container>
  )
}
