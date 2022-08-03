import { Layout } from '@components/common'
import Permit from '@components/common/Permit'
import { PERMISSIONS } from '@lib/auth'
import React from 'react'

export default function Winners() {
  return (
    <Permit permission={PERMISSIONS.WINNERS_LIST} redirect="/admin">
      Winners
    </Permit>
  )
}

Winners.Layout = Layout
