/** @jsx jsx */
import { Flex, Image, jsx } from 'theme-ui'
import { VerticalMenu, PageHeader } from 'components'
import { Global, css } from '@emotion/core'
import sibLogo from 'assets/images/mybis-logo.svg'

const GLOBAL = css(`
  html, body, #root, .page-container {
    min-height: 100vh;
    overflow: auto;
  }

  &.disabled {
    pointer-events: none;
  }
`)

const pageContainer = {
  variant: ['flex.row'],
  display: ['flex'],
}

const mainContainerSx = {
  variant: 'flex.column',
  width: '100%',
  bg: 'main.bg',
  px: [4, 7],
  minHeight: '100%',
}

const mainContentNoHeaderSx = {
  pt: [3, 4, 6],
}

export default ({
  id,
  children,
  includeOnly,
  hideHeader = false,
  hideMenu = true,
  companyLogo,
  headerTitle,
  headerSubtitle,
  userData,
}) => {
  return (
    <Flex className="page-container" id={id} sx={pageContainer}>
      <Global styles={GLOBAL} />
      {!hideMenu && (
        <VerticalMenu
          companyLogo={companyLogo}
          userData={userData}
          includeOnly={includeOnly}
        />
      )}
      <main
        sx={{
          ...mainContainerSx,
          ...(hideHeader ? mainContentNoHeaderSx : {}),
        }}
      >
        {!hideHeader && (
          <PageHeader
            title={headerTitle}
            subtitle={headerSubtitle}
            userData={userData}
          />
        )}
        {children}
        <div sx={{ alignSelf: 'center', marginTop: 'auto' }}>
          <Image
            sx={{ height: '1rem', marginTop: [5], marginBottom: [4] }}
            src={sibLogo}
          />
        </div>
      </main>
    </Flex>
  )
}
