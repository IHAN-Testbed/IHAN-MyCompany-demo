/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Heading, Container, Link, UserProfile } from 'components'
import { ReactComponent as AccountantLogo } from 'assets/images/accountant-logo.svg'
import Text from './Text'

const headerLogoSx = {
  width: ['3rem'],
  mr: [4],
  fill: 'primary',
}

const STYLE = {
  variant: ['flex.column', 'flex.rowCenter'],
  minHeight: ['10rem'],
  justifyContent: ['center', 'space-between'],
  mt: [5, 0],
  mb: [5, 5],
  borderBottom: 'menuItem',
}

const pageTitleSx = {
  fontSize: [5, 6, 7],
  fontWeight: ['bold'],
  my: [0],
  color: 'indigo',
}

export default ({ title, subtitle, userData = {}, csx }) => {
  return (
    <Container baseProps={{ className: 'page-header' }} csx={{ ...STYLE, ...csx }}>
      <Container
        csx={{
          flex: ['60%'],
        }}
      >
        <Container csx={{ variant: 'flex.row', alignItems: 'center', mb: [3] }}>
          <AccountantLogo sx={headerLogoSx} />

          <Heading csx={pageTitleSx}>{'Accounting company A' || ''}</Heading>
        </Container>

        <Container csx={{ variant: 'flex.row', alignItems: 'baseline' }}>
          <Text>{title || ''}</Text>
          {subtitle && (
            <Link csx={{ variant: 'text.mute', ml: [2] }} to="/company-select">
              (change company)
            </Link>
          )}
        </Container>
      </Container>

      <Container
        csx={{
          m: 0,
          minWidth: ['17rem'],
          flex: ['40%'],
        }}
      >
        <UserProfile
          image={userData.image}
          name={userData.name}
          subTitle={userData.jobTitle}
          baseProps={{ className: 'user-profile-container' }}
        />
      </Container>
    </Container>
  )
}
