import Permit from '@components/common/Permit'
import { Container, Text } from '@components/ui'
import Link from 'next/link'
import React from 'react'

export default function Done() {
  return (
    <Container>
      <Text variant="pageHeading" className="text-center">
        Objednavka uspesne odoslana! Dakujeme!
      </Text>
      <Permit>
        <Link href="/orders">
          <a>Zobrazit objednavky</a>
        </Link>
      </Permit>
    </Container>
  )
}
