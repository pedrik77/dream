import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

const COOKIE_NAME = 'accept_cookies'

export const useAcceptCookies = () => {
  const [acceptedCookies, setAcceptedCookies] = useState<boolean>()

  useEffect(() => {
    const cookies = Cookies.get(COOKIE_NAME)
    if (cookies !== undefined) {
      setAcceptedCookies(cookies === 'accepted')
    }
  }, [])

  const acceptCookies = () => {
    setAcceptedCookies(true)
    Cookies.set(COOKIE_NAME, 'accepted', { expires: 365 })
  }

  const rejectCookies = () => {
    setAcceptedCookies(false)
    Cookies.set(COOKIE_NAME, 'rejected', { expires: 365 })
  }

  return {
    acceptedCookies,
    acceptCookies,
    rejectCookies,
  }
}
