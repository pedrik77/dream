import Permit from '@components/common/Permit'
import { Container, Text } from '@components/ui'
import Link from 'next/link'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Done() {
  const { t } = useTranslation()

  return (
    <Container className="flex flex-col justify-center text-center my-16">
      <Text variant="pageHeading" className="my-4">
        {t('checkout.thankYou')}
      </Text>
      <Permit>
        <Link href="/orders">
          <a className="hover:text-accent-6">{t('checkout.showOrders')}</a>
        </Link>
      </Permit>
    </Container>
  )
}
