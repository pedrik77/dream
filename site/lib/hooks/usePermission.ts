import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useUser } from '@lib/auth'

export function usePermission(permission: string, redirect?: string) {
  const { hasAdminPermission } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (hasAdminPermission(permission)) return

    if (!redirect) throw Error('No redirect specified')

    router.push(redirect)
  }, [permission, redirect, router, hasAdminPermission])
}
