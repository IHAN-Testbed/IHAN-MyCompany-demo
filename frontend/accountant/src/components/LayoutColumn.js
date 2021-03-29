/** @jsx jsx */
import { Flex, Image, jsx } from 'theme-ui'
import { Link } from 'components'

const mainSx = {
  width: '100%',
  flex: '1 1 auto',
  px: 3,
}

const headerSx = {
  variant: 'flex.column',
  px: 3,
  bg: 'header.background',
}

const headerLogoSx = {
  width: [200, null, null, 300],
}

const footerSx = {
  variant: 'flex.column',
  minHeight: 100,
  p: 3,
  bg: 'footer.bg',
}

const pageContainer = {
  variant: 'flex.column',
  minHeight: '100vh',
}

const getMainContentContainerSx = (mainContentVariant) => ({
  variant: mainContentVariant,
  maxWidth: 'lg',
  mx: 'auto',
  my: 5,
})

function LayoutColumn({
  id,
  children,
  mainContentVariant = 'flex.column',
  companyLogo,
  hideFooter = false,
}) {
  return (
    <Flex className="page-container" id={id} sx={pageContainer}>
      <header sx={headerSx}>
        <Image sx={headerLogoSx} alt={'logo'} src={companyLogo} />
      </header>
      <main sx={mainSx}>
        <div
          className="main-content-container"
          sx={getMainContentContainerSx(mainContentVariant)}
        >
          {children}
        </div>
      </main>
      {!hideFooter && (
        <footer sx={footerSx}>
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
          <Link to="/404">Privacy</Link>
        </footer>
      )}
    </Flex>
  )
}

export default LayoutColumn
