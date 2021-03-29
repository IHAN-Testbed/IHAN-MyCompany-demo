// Based on bootstrap preset https://github.com/system-ui/theme-ui/blob/master/packages/preset-bootstrap/src/index.ts

import { baseColors, colors } from 'theme/colors'
import {
  fontWeights,
  fonts,
  lineHeights,
  fontSizes,
  heading,
  typeStyles,
} from 'theme/typography'
import { variants } from 'theme/variants'
import { transitions } from 'theme/transitions'

const space = [0, 0.25, 0.5, 1, 1.5, 3, 5, 7.5, 10, 20].map((n) => n + 'rem')

const breakpoints = ['576px', '768px', '992px', '1200px']

const sizes = {
  // container widths
  sm: 540,
  md: 720,
  lg: 960,
  xl: 1140,
}

const radii = {
  default: '0.25rem',
  sm: '0.2rem',
  lg: '0.3rem',
  xlg: '1rem',
  circle: '100%',
  pill: '50rem',
  zero: '0',
}

const shadows = {
  default: '0 .5rem 1rem rgba(0, 0, 0, .15)',
  sm: '0 .125rem .25rem rgba(0, 0, 0, .075)',
  lg: '0 1rem 3rem rgba(0, 0, 0, .175)',
}

const styles = {
  root: {
    fontFamily: 'body',
    lineHeight: 'body',
    fontWeight: 'body',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  a: {
    color: 'primary',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  p: {
    mb: 3,
    lineHeight: 'body',
  },
  h1: {
    ...heading,
    fontSize: 7,
  },
  h2: {
    ...heading,
    fontSize: 6,
  },
  h3: {
    ...heading,
    fontSize: 5,
  },
  h4: {
    ...heading,
    fontSize: 4,
  },
  h5: {
    ...heading,
    fontSize: 3,
  },
  h6: {
    ...heading,
    fontSize: 2,
  },
  blockquote: {
    fontSize: 3,
    mb: 3,
  },
  table: {
    width: '100%',
    marginBottom: 3,
    color: 'gray.9',
    borderCollapse: 'collapse',
  },
  th: {
    verticalAlign: 'bottom',
    borderTopWidth: 2,
    borderTopStyle: 'solid',
    borderTopColor: 'gray.3',
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: 'gray.3',
    padding: '.75rem',
    textAlign: 'inherit',
  },
  td: {
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: 'gray.3',
    verticalAlign: 'top',
    padding: '.75rem',
  },
  inlineCode: {
    color: 'pink',
  },
  img: {
    maxWidth: '100%',
    height: 'auto',
  },
}

const layout = {
  container: {},
}

const borders = {
  border: '2px solid ' + baseColors.gray[4],
  menuItem: '1px solid ' + baseColors.gray[2],
}

export default {
  breakpoints,
  colors,
  space,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  sizes,
  shadows,
  radii,
  typeStyles,
  styles,
  borders,
  transitions,
  layout,
  ...variants,
}
