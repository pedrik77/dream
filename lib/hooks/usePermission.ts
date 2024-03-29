import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { PERMISSIONS, useAuthContext } from '@lib/api/page/auth'

interface usePermissionArgs {
  permission?: string
  redirect?: string
}

export function usePermission({
  permission,
  redirect,
}: usePermissionArgs = {}) {
  const { permissions, permissionsLoaded, isLoggedIn } = useAuthContext()
  const router = useRouter()

  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    function hasPermission(permission?: string) {
      if (!permission || permission === PERMISSIONS.USER) return isLoggedIn

      if (permission === PERMISSIONS.ADMIN && !!permissions.length) return true

      if (!permission) return false

      return (
        permissions.includes(permission) ||
        permissions.includes(PERMISSIONS.SUPERADMIN)
      )
    }

    if (hasPermission(permission)) return setAllowed(true)
    else setAllowed(false)

    if (permissionsLoaded && redirect) {
      router.replace(redirect)
    }
  }, [isLoggedIn, permission, redirect, router, permissions, permissionsLoaded])

  return allowed
}
