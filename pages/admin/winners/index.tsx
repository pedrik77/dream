import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import Permit from '@components/common/Permit'
import { PERMISSIONS } from '@lib/api/page/auth'
import React from 'react'

export default function Winners() {
  return (
    <Permit permission={PERMISSIONS.WINNERS_LIST} redirect="/admin">
      <AdminLayout>Winners</AdminLayout>
    </Permit>
  )
}

Winners.Layout = Layout
