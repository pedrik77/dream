import { Button } from '@components/ui'
import { useAcceptCookies } from '@lib/hooks/useAcceptCookies'
import React from 'react'
import { useTranslation } from 'react-i18next'
import FeatureBar from '../FeatureBar'

export default function Cookies() {
  const { acceptedCookies, acceptCookies, rejectCookies } = useAcceptCookies()
  const { t } = useTranslation()

  return (
    <FeatureBar
      title={
        'Táto webstránka používa na zlepšenie vášho prehliadania súbory cookies. Používaním tejto stránky súhlasíte s našou politikou cookies.'
      }
      hide={acceptedCookies !== undefined}
      action={
        <>
          <Button variant="light" className="mx-5" onClick={rejectCookies}>
            Odmietnuť cookies
          </Button>
          <Button variant="light" className="mx-5" onClick={acceptCookies}>
            Povoliť cookies
          </Button>
        </>
      }
    />
  )
}
