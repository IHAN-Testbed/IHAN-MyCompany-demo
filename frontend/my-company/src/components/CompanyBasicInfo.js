/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Container, LabelValue } from 'components'

const STYLE = {}

const keyLabelMap = {
  companyForm: 'Company form',
  companyId: 'Business ID',
  name: 'Company name',
  registrationDate: 'Registration date',
  municipality: 'Municipality',
  language: 'Language',
  mainLine: 'Main line of business',
  postalAddress: 'Postal address',
  streetAddress: 'Street address',
  www: 'www',
  mobilePhone: 'Mobile phone',
}

export default ({ basicInfo = {}, csx }) => {
  let keys = Object.keys(basicInfo)

  if (keys.length) {
    keys = keys.map((k) => {
      if (basicInfo.hasOwnProperty(k)) {
        return <LabelValue key={k} label={keyLabelMap[k]} value={basicInfo[k]} />
      } else {
        return false
      }
    })
  }

  return <Container csx={{ ...STYLE, ...csx }}>{keys}</Container>
}
