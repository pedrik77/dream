import { useRouter } from 'next/router'
import { IGNORE_PARAMS } from '@lib/api/page/menu'

export function useIsActiveMenu() {
  const { pathname, asPath } = useRouter()

  const withoutParams = pathname
  const withParams = asPath

  return (href: string) =>
    (IGNORE_PARAMS.includes(href) ? withoutParams : withParams) === href
}
