import { FC, useRef, useEffect, useCallback } from 'react'
import s from './Modal.module.css'
import FocusTrap from '@lib/focus-trap'
import { Cross } from '@components/icons'
// @ts-ignore
import { useScrollDisable } from '@lib/hooks/useScrollDisable'

interface ModalProps {
  className?: string
  children?: any
  onClose: () => void
  onEnter?: () => void | null
}

const Modal: FC<ModalProps> = ({ children, onClose }) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>

  useScrollDisable(ref.current, onClose)

  return (
    <div className={s.root}>
      <div className={s.modal} role="dialog" ref={ref}>
        <button
          onClick={() => onClose()}
          aria-label="Close panel"
          className={s.close}
        >
          <Cross className="h-6 w-6 text-white hover:text-secondary" />
        </button>
        <FocusTrap focusFirst>{children}</FocusTrap>
      </div>
    </div>
  )
}

export default Modal
