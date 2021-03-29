/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Container, Text } from 'components'

const STYLE = {
  variant: 'flex.row',
  m: 1,
}

const labelSx = {
  variant: 'text.bold',
  minWidth: ['10rem', '15rem'],
}

const valueSx = {}

export default ({ label, value, csx }) => {
  return (
    <Container csx={{ ...STYLE, ...csx }}>
      <Text csx={labelSx}>{label}</Text>
      <Text csx={valueSx}>{value}</Text>
    </Container>
  )
}
