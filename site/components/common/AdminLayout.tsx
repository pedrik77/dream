import { Container } from '@components/ui'
import React from 'react'

export default function AdminLayout({ children }: { children?: any }) {
  return (
    <Container className="py-16">
      <div>{children}</div>
    </Container>
  )
}
