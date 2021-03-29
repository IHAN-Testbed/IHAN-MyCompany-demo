/** @jsx jsx */
import { Heading, jsx } from 'theme-ui'

const STYLE = {
  my: 3,
  wordBreak: 'break-word',
}

export default ({ children, baseProps = {}, csx }) => {
  if (!baseProps.hasOwnProperty('as')) {
    baseProps.as = baseProps.as || 'h1'
  }

  return (
    <Heading sx={{ ...STYLE, ...csx }} {...baseProps}>
      {children}
    </Heading>
  )
}
