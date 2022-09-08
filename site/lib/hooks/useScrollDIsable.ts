import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { useCallback, useEffect } from 'react'

export const useScrollDisable = (
  target: HTMLElement | Element | null,
  onClose = () => {}
) => {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        return onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (target) {
      disableBodyScroll(target, { reserveScrollBarGap: true })
      window.addEventListener('keydown', handleKey)
    }
    return () => {
      clearAllBodyScrollLocks()
      window.removeEventListener('keydown', handleKey)
    }
  }, [handleKey, target])
}
