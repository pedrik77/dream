import Link from 'next/link'
import s from './MenuSidebarView.module.css'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'
import type { Link as LinkProps } from './index'
import { useIsActiveMenu } from '@lib/useIsActiveMenu'

export default function MenuSidebarView({
  links = [],
}: {
  links?: LinkProps[]
}) {
  const { closeSidebar } = useUI()

  const isActive = useIsActiveMenu()

  return (
    <SidebarLayout handleClose={() => closeSidebar()}>
      <div className={s.root}>
        <nav>
          <ul>
            {links.map((l: any) => (
              <li
                key={l.href}
                className={s.item}
                onClick={() => closeSidebar()}
              >
                <Link href={'/' + l.href}>
                  <a
                    className={`${s.link} ${isActive(l.href) ? s.active : ''}`}
                  >
                    {l.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </SidebarLayout>
  )
}

MenuSidebarView
