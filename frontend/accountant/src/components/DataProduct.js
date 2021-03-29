/** @jsx jsx */
import { Image, jsx } from 'theme-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareAltSquare } from '@fortawesome/free-solid-svg-icons'

import { Container, Text } from 'components'
import Theme from 'theme'

const STYLE = {
  position: 'relative',
  '.share-icon-container': {
    color: 'text',
    transition: Theme.transitions.setDefault('color'),
  },
}

const contentContainerSx = {
  variant: 'flex.rowCenter',
  objectFit: 'contain',
  maxHeight: ['5.5rem'],
  bg: 'dataProduct.bg',
  px: 3,
  py: 4,
  overflow: 'hidden',
}

const imageSx = {
  width: ['6rem'],
}

const detailsSx = {
  my: 0,
  ml: [3],
}

const nameSx = {
  variant: 'text.bold',
}

const descriptionSx = {
  variant: 'text.mute',
}

const shareBadgeSx = {
  variant: 'flex.columnCenterNoMargin',
  // bg: 'yellow',
  right: [3],
  width: ['3rem'],
  height: ['100%'],
}

export default ({
  image,
  name,
  description,
  isForSharing = false,
  baseProps = {},
  csx,
}) => {
  if (isForSharing) {
    csx = {
      ...csx,
      ...Theme.transitions.onHover.default,
      // TODO: Find better way to extend default transition
      '&:hover': {
        transform: 'scale(1.0125)',
        '.share-icon-container': {
          color: 'yellow',
        },
      },
    }
  }

  return (
    <Container
      csx={{ ...STYLE, ...csx }}
      baseProps={{
        ...baseProps,
        className: 'company-card-horizontal-container',
      }}
    >
      <Container baseProps={{ className: 'data-product' }} csx={contentContainerSx}>
        {/* Image size should be standardized for better result */}
        {image && <Image sx={imageSx} alt={'Data product ' + name} src={image} />}
        <Container csx={detailsSx}>
          <Text csx={nameSx}>{name}</Text>
          <Text csx={descriptionSx}>{description}</Text>
        </Container>
        {isForSharing && (
          <div sx={shareBadgeSx}>
            <FontAwesomeIcon
              className="share-icon-container"
              size="2x"
              sx={{ ml: 1 }}
              icon={faShareAltSquare}
            />
          </div>
        )}
      </Container>
    </Container>
  )
}
