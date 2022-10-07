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
      title={t('cookies.consent')}
      hide={acceptedCookies !== undefined}
      action={
        <>
          <Button variant="light" className="mx-5" onClick={rejectCookies}>
            {t('cookies.reject')}
          </Button>
          <Button variant="light" className="mx-5" onClick={acceptCookies}>
            {t('cookies.accept')}
          </Button>
        </>
      }
    />
  )
}
