import { Container, Text } from '@components/ui'
import { useAuthContext } from '@lib/auth'
import Link from 'next/link'
import React from 'react'

export default function Done() {
  const { isLoggedIn } = useAuthContext()

  return (
    <Container>
      <Text variant="pageHeading" className="text-center">
        Objednavka uspesne odoslana! Dakujeme!
      </Text>
      <Link href="/orders">
        <a>Zobrazit objednavky</a>
      </Link>
    </Container>
  )
}
