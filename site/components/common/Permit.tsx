import { usePermission } from '@lib/hooks/usePermission'
import React from 'react'

interface PermitProps {
  permission?: string
  redirect?: string
}

const Permit: React.FC<PermitProps> = ({ permission, redirect, children }) => {
  if (!usePermission({ permission, redirect })) return null

  return <>{children}</>
}

export default Permit
