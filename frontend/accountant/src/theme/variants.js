import { darken, lighten } from '@theme-ui/color'

const defaults = {
  button: {
    cursor: 'pointer',
    borderRadius: 'default',
    color: 'light',
    bg: 'primary',
    '&:hover': {
      bg: darken('primary', 0.1),
    },
    '&.active': {
      bg: darken('primary', 0.2),
      color: darken('light', 0.2),
    },
    '.button-spinner': {
      color: 'white',
    },
    '&[disabled]': {
      pointerEvents: 'none',
      opacity: 0.8,
    },
  },
  text: {
    fontSize: [1, 2],
  },
}

const variants = {
  flex: {
    column: {
      width: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'normal',
      alignItems: 'normal',
    },
    row: {
      width: 'auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'normal',
      alignItems: 'normal',
    },
    columnCenter: {
      width: 'auto%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    columnCenterNoMargin: {
      width: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowCenter: {
      width: 'auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  cards: {
    primary: {
      padding: 2,
      borderRadius: 4,
      boxShadow: 'default',
    },
    compact: {
      padding: 1,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'muted',
    },
  },
  text: {
    sectionHeader: {
      ...defaults.text,
      fontSize: [2, 3],
      mb: [3],
      fontWeight: ['bold'],
    },
    notice: {
      ...defaults.text,
      fontWeight: [900],
      color: 'indigo',
    },
    bold: {
      ...defaults.text,
      fontWeight: [900],
    },
    mute: {
      ...defaults.text,
      fontWeight: [400],
      fontStyle: 'italic',
      fontSize: 1,
      color: lighten('text', 0.4),
    },
    error: {
      ...defaults.text,
      fontWeight: [400],
      fontStyle: 'italic',
      fontSize: 1,
      color: 'danger',
    },
  },
  buttons: {
    primary: {
      ...defaults.button,
    },
    secondary: {
      ...defaults.button,
      bg: 'secondary',
      '&:hover': {
        bg: darken('secondary', 0.1),
      },
      '&.active': {
        bg: darken('secondary', 0.2),
        color: darken('light', 0.2),
      },
    },
    success: {
      ...defaults.button,
      bg: 'success',
      '&:hover': {
        bg: darken('success', 0.1),
      },
      '&.active': {
        bg: darken('success', 0.2),
        color: darken('light', 0.2),
      },
    },
    danger: {
      ...defaults.button,
      bg: 'danger',
      '&:hover': {
        bg: darken('danger', 0.1),
      },
      '&.active': {
        bg: darken('danger', 0.2),
        color: darken('light', 0.2),
      },
    },
  },
}

export { variants }
