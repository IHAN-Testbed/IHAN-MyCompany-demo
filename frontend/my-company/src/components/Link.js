/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Link } from 'react-router-dom'

export default ({ children, to = '/' }) => {
  return (
    <Link
      to={{
        pathname: to,
      }}
    >
      {children}
    </Link>
  )
}
