/** @jsx jsx */
import { Spinner, jsx } from 'theme-ui'
import classNames from 'classnames'

const STYLE = {
  color: 'text',
}

export default ({ className = [], baseProps = {}, csx }) => {
  return (
    <Spinner
      className={classNames('loading-indicator-component', className, csx?.variant)}
      sx={{ ...STYLE, ...csx }}
      {...baseProps}
    />
  )
}
