/** @jsx jsx */
import { useState } from 'react'
import { Button, jsx } from 'theme-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faSpinner,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'

const STYLE = {
  fontSize: [1, 2],
  '.button-icon': {
    mr: 2,
  },
}

const ASYNC_ON_CLICK = {
  asyncFn: () => false,
  onAsyncFinish: () => false,
  loadingText: 'Loading...',
  successText: 'Complete!',
  failText: 'Failed!',
  resetStateTimeOut: 0,
  setErrorCb: (res, setError, setSuccess) => false,
}

export default ({
  children,
  onClick,
  baseProps = {},
  asyncOnClick,
  isDisabled,
  csx,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  if (typeof asyncOnClick !== 'undefined') {
    asyncOnClick = {
      ...ASYNC_ON_CLICK,
      ...asyncOnClick,
    }
  }

  const onClickWrapper = async (e) => {
    e.preventDefault()

    if (typeof onClick === 'function') {
      const target = e.target
      target.classList.add('active')

      setTimeout(() => {
        target.classList.remove('active')
      }, 100)

      onClick()
    } else if (typeof asyncOnClick !== 'undefined') {
      setIsLoading(true)

      const res = await asyncOnClick.asyncFn()

      setIsLoading(false)

      if (res.ok) {
        setIsSuccess(true)
      } else {
        if (typeof asyncOnClick?.setErrorCb !== 'undefined') {
          asyncOnClick.setErrorCb(
            res,
            setIsError.bind(this, true),
            setIsSuccess.bind(this, true)
          )
        } else {
          setIsError(true)
        }
      }

      asyncOnClick.onAsyncFinish(res)

      if (asyncOnClick.resetStateTimeOut > 0) {
        setTimeout(() => {
          setIsLoading(false)
          setIsSuccess(false)
          setIsError(false)
        }, asyncOnClick.resetStateTimeOut)
      }
    }
  }

  let buttonTextContent =
    typeof children === 'string' ? <span>{children}</span> : children

  if (isLoading) {
    buttonTextContent = <span>{asyncOnClick.loadingText}</span>
  }

  if (isSuccess) {
    csx = {
      ...csx,
      variant: 'buttons.success',
    }

    buttonTextContent = <span>{asyncOnClick.successText}</span>
  }

  if (isError) {
    csx = {
      ...csx,
      variant: 'buttons.danger',
    }

    buttonTextContent = <span>{asyncOnClick.failText}</span>
  }

  const _isDisabled = isSuccess || isLoading || isError || isDisabled

  return (
    <Button
      disabled={_isDisabled}
      onClick={onClickWrapper}
      sx={{ ...STYLE, ...csx }}
      {...baseProps}
    >
      <div className="button-content-container">
        {isLoading && <FontAwesomeIcon spin className="button-icon" icon={faSpinner} />}

        {isSuccess && <FontAwesomeIcon className="button-icon" icon={faCheckCircle} />}

        {isError && <FontAwesomeIcon className="button-icon" icon={faTimesCircle} />}

        {buttonTextContent}
      </div>
    </Button>
  )
}
