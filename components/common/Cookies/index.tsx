import { Button } from '@components/ui'
import { useAcceptCookies } from '@lib/hooks/useAcceptCookies'
import React from 'react'
import { useTranslation } from 'react-i18next'
import FeatureBar from '../FeatureBar'
import Link from '@components/ui/Link'

export default function Cookies() {
  const { acceptedCookies, acceptCookies, rejectCookies } = useAcceptCookies()
  const { t } = useTranslation()

  return (
    <FeatureBar
      title={
        <>
          Táto webstránka používa na zlepšenie vášho prehliadania súbory
          cookies. Používaním tejto stránky súhlasíte s našou{' '}
          <Link href="/ochrana-osobnych-udajov" className="underline">
            politikou cookies
          </Link>
          .
        </>
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
