/** @jsx jsx */
import { Flex, jsx } from 'theme-ui'
import { VerticalMenu, PageHeader } from 'components'
import { Global, css } from '@emotion/core'
import LayoutImage from 'assets/images/layout-side.png'

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
  width: '100%',
  bg: 'main.bg',
  px: [4, 7],
  pr: [3, 3],
  minHeight: '100%',
  backgroundImage: [null, `url(${LayoutImage})`],
  backgroundRepeat: 'no-repeat',
  backgroundPositionY: '15%',
}

const mainContentNoHeaderSx = {
  pt: [3, 4, 6],
}

export default ({
  id,
  children,
  includeOnly,
  hideHeader = false,
  hideMenu = false,
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
      </main>
    </Flex>
  )
}
