import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useUser } from '@lib/auth'

interface usePermissionArgs {
  permission?: string
  redirect?: string
}

export function usePermission({
  permission,
  redirect,
}: usePermissionArgs = {}) {
  const { hasAdminPermission } = useUser()
  const router = useRouter()

  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (hasAdminPermission(permission)) return setAllowed(true)

    setAllowed(false)

    if (redirect) router.push(redirect)
  }, [permission, redirect, router, hasAdminPermission])

  return allowed
}
