import { useUser } from '@lib/auth'
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
  const { hasAdminPermission } = useUser()
  if (!hasAdminPermission(permission, orSuperAdmin)) return null

  return <>{children}</>
}

export default AdminPermit
