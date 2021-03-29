/** @jsx jsx */
// Unfortunately react-select has not updated react deps on time
// that's why there are warnings in console during development and production
import Select from 'react-select'
import { jsx } from 'theme-ui'

const STYLE = {
  my: 3,
  maxWidth: ['80%'],
}

export default ({ onChange = () => false, baseProps = {}, csx }) => {
  baseProps = {
    ...baseProps,
    defaultValue: baseProps.defaultValue || baseProps.options[0],
    onChange: onChange,
  }

  return <Select sx={{ ...STYLE, ...csx }} {...baseProps} />
}
