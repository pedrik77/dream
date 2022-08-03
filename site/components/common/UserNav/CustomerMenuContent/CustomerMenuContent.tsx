import cn from 'clsx'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { Moon, Sun } from '@components/icons'
import s from './CustomerMenuContent.module.css'
import {
  DropdownContent,
  DropdownMenuItem,
} from '@components/ui/Dropdown/Dropdown'
import { signOut } from '@lib/auth'
import { flash } from '@components/ui/FlashMessage'

const LINKS = [
  {
    name: 'My Orders',
    href: '/orders',
  },
  {
    name: 'My Account',
    href: '/account',
  },
  {
    name: 'My Cart',
    href: '/cart',
  },
]

export default function CustomerMenuContent() {
  const router = useRouter()
  const { theme, setTheme } = useTheme('light')

  function handleClick(_: React.MouseEvent<HTMLAnchorElement>, href: string) {
    router.push(href)
  }

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
          Logout
        </a>
      </DropdownMenuItem>
    </DropdownContent>
  )
}
