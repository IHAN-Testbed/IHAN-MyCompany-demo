const fonts = {
  body: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial',
  heading: 'inherit',
  monospace:
    'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  sans: '',
}
fonts.sans = fonts.body

const fontWeights = {
  body: 400,
  heading: 500,
  bold: 700,
  light: 300,
  normal: 0,
  display: 0,
}
fontWeights.normal = fontWeights.body
fontWeights.display = fontWeights.light

const fontSizes = [
  '0.75rem', // '80%',
  '0.875rem',
  '1rem',
  '1.25rem',
  '1.5rem',
  '1.75rem',
  '2rem',
  '2.5rem',
  '3.5rem',
  '4.5rem',
  '5.5rem',
  '6rem',
]
fontSizes.lead = fontSizes[3]

const lineHeights = {
  body: 1.5,
  heading: 1.2,
}

const heading = {
  fontFamily: 'heading',
  fontWeight: 'heading',
  lineHeight: 'heading',
  mt: 0,
  mb: 2,
}
const display = {
  fontWeight: 'display',
  lineHeight: 'heading',
}

// variants
const typeStyles = {
  heading,
  display,
}

export { fonts, fontSizes, fontWeights, lineHeights, display, heading, typeStyles }
