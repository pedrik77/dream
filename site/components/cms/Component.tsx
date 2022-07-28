import { PERMISSIONS, useAuthContext } from '@lib/auth'
import React, { useState } from 'react'

export default function Component({ multiple = false }) {
  const { hasAdminPermission } = useAuthContext()

  const [isEditing, setIsEditing] = useState(false)

  const canEdit = hasAdminPermission(PERMISSIONS.CMS)

  return <></>
}
