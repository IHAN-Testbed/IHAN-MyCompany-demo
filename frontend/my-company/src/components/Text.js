/** @jsx jsx */
import { Text, jsx } from 'theme-ui'

const STYLE = {}

export default ({ children, baseProps = {}, csx }) => {
  return (
    <Text sx={{ ...STYLE, ...csx }} {...baseProps}>
      {children}
    </Text>
  )
}
