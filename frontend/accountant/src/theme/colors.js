import { lighten } from '@theme-ui/color'

const baseColors = {
  white: '#fff',
  black: '#000',
  gray: [
    '#fff', // 0 index
    '#f8f9fa',
    '#e9ecef',
    '#dee2e6',
    '#ced4da',
    '#adb5bd',
    '#6c757d',
    '#495057',
    '#343a40',
    '#212529',
  ],
  blue: '#007bff',
  indigo: '#6610f2',
  purple: '#6f42c1',
  pink: '#e83e8c',
  red: '#dc3545',
  orange: '#fd7e14',
  yellow: '#ffc107',
  green: '#28a745',
  teal: '#20c997',
  cyan: '#17a2b8',
}

let colors = {
  ...baseColors,
  grayDark: baseColors.gray[8],
  text: baseColors.gray[9],
  background: baseColors.white,
  primary: baseColors.indigo,
  secondary: baseColors.gray[6],
  muted: baseColors.gray[3],
  success: baseColors.green,
  info: baseColors.cyan,
  warning: baseColors.yellow,
  danger: baseColors.red,
  light: baseColors.gray[1],
  dark: baseColors.gray[8],
  textMuted: baseColors.gray[6],
}

colors = {
  ...colors,
  modalBackground: colors.background,
  menu: {
    bg: colors.background,
  },
  header: {
    bg: colors.background,
  },
  main: {
    bg: baseColors.gray[0],
  },
  footer: {
    bg: baseColors.gray[2],
  },
  menuItem: {
    text: colors.text,
    bg: colors.background,
    hover: {
      text: colors.background,
      bg: colors.text,
    },
    active: {
      text: colors.background,
      bg: colors.text,
    },
  },
  dataProduct: {
    bg: lighten(colors.primary, 0.45)(),
  },
}

export { colors, baseColors }
