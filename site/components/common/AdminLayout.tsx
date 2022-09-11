import { Container } from '@components/ui'
import { PERMISSIONS } from '@lib/auth'
import React from 'react'
import Permit from './Permit'

export default function AdminLayout({ children }: { children?: any }) {
  return (
    <Permit permission={PERMISSIONS.ADMIN} redirect="/">
      <Container className="py-16">
        <div>{children}</div>
      </Container>
    </Permit>
  )
}
