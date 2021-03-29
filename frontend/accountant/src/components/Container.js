/** @jsx jsx */
import { Container, jsx } from 'theme-ui'
import classNames from 'classnames'

const STYLE = {
  my: 0,
  mx: 0,
}

export default ({ className = [], children, onClick, baseProps = {}, csx }) => {
  return (
    <Container
      onClick={onClick}
      className={classNames('container-component', className, csx?.variant)}
      sx={{ ...STYLE, ...csx }}
      {...baseProps}
    >
      {children}
    </Container>
  )
}
