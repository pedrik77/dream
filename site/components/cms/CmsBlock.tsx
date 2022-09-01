import { PERMISSIONS } from '@lib/auth'
import { useCmsBlock } from '@lib/components'
import { usePermission } from '@lib/hooks/usePermission'
import React, { useEffect, useState } from 'react'

interface CmsBlockProps {
  id: string
  onlyEdit?: boolean
  onlyView?: boolean
  multiple?: boolean
}

interface ComponentProps {
  type: string
  value: string
  onChange?: (value: string) => void
  isEditing?: boolean
}

export default function CmsBlock({
  id,
  onlyEdit,
  onlyView,
  multiple,
}: CmsBlockProps) {
  const canEdit = usePermission({ permission: PERMISSIONS.CMS })
  const block = useCmsBlock({ id })

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (onlyEdit) setIsEditing(true)

    if (onlyView) setIsEditing(false)

    if (!canEdit) setIsEditing(false)
  }, [onlyEdit, onlyView, canEdit])

  return (
    <>
      {block.components.map((c, i) => (
        <Component key={i} {...c} isEditing={isEditing} />
      ))}
    </>
  )
}

function Component({}: ComponentProps) {
  return <></>
}
