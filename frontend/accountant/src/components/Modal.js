/** @jsx jsx */
import { jsx } from 'theme-ui'
import Modal from 'react-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Theme from 'theme'

const backdropSx = {
  position: 'fixed',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
  backgroundColor: 'rgba(0,0,0,0.2)',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
}

const contentContainerSx = {
  position: 'absolute',
  maxWidth: ['90%', 'md'],
  minWidth: ['20rem', '40rem'],
  border: 'border',
  borderRadius: 'lg',
  bg: 'modalBackground',
  outline: 'none',
  px: [3, 5],
  py: [1, 3],
  mt: ['2rem', '10rem'],
  boxShadow: 'default',
}

const closeButtonSx = {
  ...Theme.transitions.onHover.default,
  position: 'absolute',
  right: 2,
  fontSize: [4, 5],
  margin: '0 1rem',
  '&:hover': {
    transform: 'scale(1.125)',
  },
}

export default ({ children, isOpen, onCloseClick, onAfterClose = () => false }) => {
  Modal.setAppElement('#root')

  return (
    <Modal
      sx={backdropSx}
      closeTimeoutMS={100}
      isOpen={isOpen}
      onAfterClose={onAfterClose}
      contentLabel="Base Modal"
      aria={{
        labelledby: 'Base modal label',
        describedby: 'Base model description',
      }}
      style={{ overlay: { zIndex: 999 } }}
    >
      <div className="content-container" sx={contentContainerSx}>
        <div onClick={onCloseClick} tabIndex="0" sx={closeButtonSx}>
          <FontAwesomeIcon className="button-icon" icon={faTimes} />
        </div>
        {children}
      </div>
    </Modal>
  )
}
