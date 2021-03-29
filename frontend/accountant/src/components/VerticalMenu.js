/** @jsx jsx */
import { Flex, Image, useThemeUI, jsx } from 'theme-ui'

import { ReactComponent as IconCompany } from 'assets/images/icon-company.svg'
import { ReactComponent as IconBoard } from 'assets/images/icon-board.svg'
import { ReactComponent as IconFinancials } from 'assets/images/icon-financials.svg'
import { ReactComponent as IconOwnership } from 'assets/images/icon-ownership.svg'
import { ReactComponent as IconCompanySwitch } from 'assets/images/icon-company-switch.svg'
import { ReactComponent as IconCompanySearch } from 'assets/images/icon-company-search.svg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { Text } from 'components'
import { useHistory, useParams, useRouteMatch } from 'react-router-dom'
import { API } from 'utilities'

const STYLE = {
  width: [null, '25rem'],
  display: ['none', null, null, 'block'],
  bg: 'menu.bg',
  zIndex: 100,
}

const headerSx = {
  variant: 'flex.column',
  px: 3,
}

const headerLogoSx = {
  width: ['10rem'],
  py: 5,
  margin: 'auto',
}

const navSx = {
  variant: 'flex.column',
}

const menuTextSx = {
  width: '50%',
}

const MENU_ITEMS = [
  { text: 'Company', iconElement: IconCompany, href: '/company/:businessId' },
  { text: 'Board', iconElement: IconBoard, href: '/company/:businessId/board' },
  {
    text: 'Financials',
    iconElement: IconFinancials,
    href: '/company/:businessId/financials',
    disabled: true,
  },
  {
    text: 'Ownership',
    iconElement: IconOwnership,
    href: '/company/:businessId/ownership',
  },
  {
    text: 'Search company',
    iconElement: IconCompanySearch,
    href: '/company/:businessId/company-search',
  },
  {
    text: 'Switch company',
    iconElement: IconCompanySwitch,
    href: '/company-select',
  },
  { text: 'Log in', icon: faSignInAlt, href: '/login' },
  {
    text: 'Log out',
    icon: faSignOutAlt,
    href: '/logout',
    onClick: async (history) => {
      const { ok } = await API.logout()
      if (ok) {
        history.push('/login')
      }
    },
  },
]

export default ({
  activeItem,
  includeOnly = [
    'Company',
    'Board',
    'Financials',
    'Ownership',
    'Search company',
    'Switch company',
  ],
  companyLogo,
  userData,
  csx,
}) => {
  let menuItems = []

  if (typeof userData !== 'undefined') {
    includeOnly.push('Log out')
  }

  if (includeOnly.length > 0) {
    includeOnly.forEach((i) => {
      menuItems.push(MENU_ITEMS.find((mi) => mi.text === i))
    })
  } else {
    menuItems = MENU_ITEMS
  }

  return (
    <div id="vertical-menu" sx={{ ...STYLE, ...csx }}>
      <header sx={headerSx}>
        <Image sx={headerLogoSx} alt={'logo'} src={companyLogo} />
      </header>
      <Flex sx={navSx} as="nav">
        {menuItems.map((mi) => {
          return (
            <MenuItem
              key={`Item-${mi.href}`}
              isActive={mi.text === activeItem}
              href={mi.href}
              onClick={mi.onClick}
              icon={mi.icon}
              IconElement={mi.iconElement}
              text={mi.text}
              disabled={mi.disabled}
            />
          )
        })}
      </Flex>
    </div>
  )
}

const MenuItem = ({ text, IconElement, icon, href, onClick, disabled = false }) => {
  const history = useHistory()
  const { theme } = useThemeUI()
  const { businessId } = useParams()

  const menuItemSx = {
    variant: 'flex.rowCenter',
    justifyContent: 'space-evenly',
    minHeight: '5rem',
    bg: 'menuItem.bg',
    color: 'menuItem.text',
    cursor: 'pointer',
    borderBottom: 'menuItem',
    fontWeight: 'heading',
    '&.disabled': {
      color: 'muted',
      '.icon-container': {
        'svg g *': {
          fill: `${theme.colors.muted} !important`,
        },
      },
    },
    '.icon-container': {
      height: ['2rem'],
      width: ['2rem'],
      'svg path': {
        fill: `${theme.colors.menuItem.text} !important`,
      },
    },
    '&:hover': {
      bg: 'menuItem.hover.bg',
      color: 'menuItem.hover.text',
      '.icon-container': {
        'svg path': {
          fill: `${theme.colors.menuItem.hover.text} !important`,
        },
      },
    },
    '&.active': {
      bg: 'menuItem.active.bg',
      color: 'menuItem.active.text',
      pointerEvents: 'none',
      '.icon-container': {
        'svg path': {
          fill: `${theme.colors.menuItem.active.text} !important`,
        },
      },
    },
  }

  let match = useRouteMatch({
    path: href,
    exact: true,
  })

  href = href.replace(':businessId', businessId)

  const onItemClick = () => {
    if (typeof onClick === 'function') {
      onClick(history)
    } else {
      history.push({
        pathname: href,
      })
    }
  }

  return (
    <div
      onClick={onItemClick}
      sx={menuItemSx}
      className={`menu-item ${match !== null ? 'active' : ''} ${
        disabled ? 'disabled' : ''
      }`}
    >
      {IconElement && (
        <div className="icon-container">
          <IconElement />
        </div>
      )}

      {icon && <FontAwesomeIcon size="lg" className="button-icon" icon={icon} />}
      <Text csx={menuTextSx}>{text}</Text>
    </div>
  )
}
