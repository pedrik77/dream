import { useRouter } from 'next/router'
import { IGNORE_PARAMS } from './menu'

export function useIsActiveMenu() {
  const { pathname, asPath } = useRouter()

  const withoutParams = pathname.substring(1)
  const withParams = asPath.substring(1)

  return (href: string) =>
    (IGNORE_PARAMS.includes(href) ? withoutParams : withParams) === href
}
