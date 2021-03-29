/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Link } from 'react-router-dom'

export default ({ children, to = '/', csx }) => {
  return (
    <Link
      sx={csx}
      to={{
        pathname: to,
      }}
    >
      {children}
    </Link>
  )
}
