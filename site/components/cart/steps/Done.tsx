import Permit from '@components/common/Permit'
import { Container, Text } from '@components/ui'
import Link from 'next/link'
import React from 'react'

export default function Done() {
  return (
    <Container className="flex flex-col justify-center text-center my-16">
      <Text variant="pageHeading" className="my-4">
        Objednávka úspešne odoslaná! Ďakujeme!
      </Text>
      <Permit>
        <Link href="/orders">
          <a className="hover:text-accent-6">Zobraziť objednávky</a>
        </Link>
      </Permit>
    </Container>
  )
}
