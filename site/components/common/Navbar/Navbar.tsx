import { FC } from 'react'
import Link from 'next/link'
import s from './Navbar.module.css'
import NavbarRoot from './NavbarRoot'
import { Logo, Container } from '@components/ui'
import { Searchbar, UserNav } from '@components/common'
import { useIsActiveMenu } from '@lib/useIsActiveMenu'
import { Skeleton } from '@mui/material'

interface Link {
  href: string
  label: string
}

interface NavbarProps {
  links?: Link[]
}

const Navbar: FC<NavbarProps> = ({ links = [] }) => {
  const isActive = useIsActiveMenu()

  return (
    <NavbarRoot>
      <Container clean className={s.navContainer}>
        <div className={s.nav}>
          <Link href="/">
            <a className={s.logo} aria-label="Logo">
              <Logo />
            </a>
          </Link>

          <nav className={s.navMenu}>
            {!links.length
              ? Skeletons
              : links.map((l) => (
                  <Link href={l.href} key={l.href}>
                    <a
                      className={`${s.link} ${
                        isActive(l.href) ? s.active : ''
                      }`}
                    >
                      {l.label}
                    </a>
                  </Link>
                ))}
          </nav>
          <UserNav />
        </div>

        {process.env.COMMERCE_SEARCH_ENABLED && (
          <div className="flex pb-4 lg:px-6 lg:hidden">
            <Searchbar id="mobile-search" />
          </div>
        )}
      </Container>
    </NavbarRoot>
  )
}

const Skeletons = Array(1)
  .fill(null)
  .map((_, i) => (
    <Skeleton
      key={i}
      className={s.link}
      width={420}
      height={32}
      animation="pulse"
    />
  ))

export default Navbar
