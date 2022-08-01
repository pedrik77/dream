import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthContext } from '@lib/auth'

interface usePermissionArgs {
  permission?: string
  redirect?: string
}

export function usePermission({
  permission,
  redirect,
}: usePermissionArgs = {}) {
  const { permissions, permissionsLoaded } = useAuthContext()
  const router = useRouter()

  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const hasAdminPermission = (permission?: string) => {
      if (!permission && !!permissions.length) {
        return true
      }

      if (!permission) return false

      return (
        permissions.includes(permission) || permissions.includes('superadmin')
      )
    }

    if (hasAdminPermission(permission)) {
      return setAllowed(true)
    }

    setAllowed(false)

    if (permissionsLoaded && redirect) {
      router.replace(redirect)
    }
  }, [permission, redirect, router, permissions, permissionsLoaded])

  return allowed
}
