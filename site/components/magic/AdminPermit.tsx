import { useUser } from '@lib/auth'
import { usePermission } from '@lib/hooks/usePermission'
import React from 'react'

interface AdminPermitProps {
  orSuperAdmin?: boolean
  permission?: string
}

const AdminPermit: React.FC<AdminPermitProps> = ({
  permission = 'superadmin',
  orSuperAdmin,
  children,
}) => {
  const allowed = usePermission({ permission })

  if (!allowed) return null

  return <>{children}</>
}

export default AdminPermit
