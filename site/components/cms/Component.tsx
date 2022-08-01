import { PERMISSIONS } from '@lib/auth'
import { usePermission } from '@lib/hooks/usePermission'
import React, { useState } from 'react'

export default function Component({ multiple = false }) {
  const [isEditing, setIsEditing] = useState(false)

  const canEdit = usePermission({ permission: PERMISSIONS.CMS })

  return <></>
}
