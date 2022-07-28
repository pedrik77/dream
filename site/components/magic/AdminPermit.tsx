import { usePermission } from '@lib/hooks/usePermission'
import React from 'react'

interface AdminPermitProps {
  orSuperAdmin?: boolean
  permission?: string
}

const AdminPermit: React.FC<AdminPermitProps> = ({ permission, children }) => {
  if (!usePermission({ permission })) return null

  return <>{children}</>
}

export default AdminPermit
