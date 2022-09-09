import { useAuthContext } from '@lib/auth'
import React from 'react'

export default function AdminWidget() {
  const { permissions, adminEditingMode, adminStartEditing, adminStopEditing } =
    useAuthContext()

  if (!permissions.length) return null

  return (
    <div
      className={`fixed cursor-pointer h-16 w-16 right-12 bottom-12 rounded-2xl z-50 hidden md:block ${
        adminEditingMode ? 'bg-primary' : 'bg-secondary'
      }`}
      onClick={adminEditingMode ? adminStopEditing : adminStartEditing}
    ></div>
  )
}
