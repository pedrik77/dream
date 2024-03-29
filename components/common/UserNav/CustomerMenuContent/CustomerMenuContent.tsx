import cn from 'clsx'
import { useRouter } from 'next/router'
import s from './CustomerMenuContent.module.css'
import {
  DropdownContent,
  DropdownMenuItem,
} from '@components/ui/Dropdown/Dropdown'
import { signOut } from '@lib/api/page/auth'
import { flash } from '@components/ui/FlashMessage'
import { useTranslation } from 'react-i18next'

export default function CustomerMenuContent() {
  const router = useRouter()
  const { t } = useTranslation()

  function handleClick(_: React.MouseEvent<HTMLAnchorElement>, href: string) {
    router.push(href)
  }
  const LINKS = [
    {
      name: t('navbar.user.prizes'),
      href: '/prizes',
    },
    {
      name: t('navbar.user.orders'),
      href: '/orders',
    },
    {
      name: t('navbar.user.account'),
      href: '/account',
    },
    {
      name: t('navbar.user.cart'),
      href: '/cart',
    },
  ]

  return (
    <DropdownContent
      asChild
      side="bottom"
      sideOffset={10}
      className={s.root}
      id="CustomerMenuContent"
    >
      {LINKS.map(({ name, href }) => (
        <DropdownMenuItem key={href}>
          <a
            className={cn(s.link, {
              [s.active]: router.pathname === href,
            })}
            onClick={(e) => handleClick(e, href)}
          >
            {name}
          </a>
        </DropdownMenuItem>
      ))}
      <DropdownMenuItem></DropdownMenuItem>
      <DropdownMenuItem>
        <a
          className={cn(s.link, 'border-t border-accent-2 mt-4')}
          onClick={async () => {
            await signOut()
            flash('Boli ste úspešne odhlásený', 'success')
          }}
        >
          {t('navbar.user.signOut')}
        </a>
      </DropdownMenuItem>
    </DropdownContent>
  )
}
