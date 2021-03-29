let transitions = {
  setDefault: (property) => `${property} 100ms cubic-bezier(0.65, 0.05, 0.36, 1)`,
}

transitions = {
  ...transitions,
  onHover: {
    default: {
      transition: transitions.setDefault('transform'),
      cursor: 'pointer',
      '&:hover': {
        transform: 'scale(1.0125)',
      },
    },
    brightness: {
      cursor: 'pointer',
      '&:hover': {
        filter: 'brightness(0.5)',
      },
    },
  },
}

export { transitions }
