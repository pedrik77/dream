import cn from 'clsx'
import s from './UserNav.module.css'
import { Avatar } from '@components/common'
import { useUI } from '@components/ui/context'
import { Heart, Bag, Menu } from '@components/icons'
import CustomerMenuContent from './CustomerMenuContent'
import React from 'react'
import {
  Dropdown,
  DropdownTrigger as DropdownTriggerInst,
  Button,
} from '@components/ui'

import { useAuthContext } from '@lib/api/page/auth'
import { useRouter } from 'next/router'

const UserNav: React.FC<{
  className?: string
}> = ({ className }) => {
  const { isLoggedIn } = useAuthContext()
  const router = useRouter()
  const {
    toggleSidebar,
    openModal,
    setSidebarView,
    openSidebar,
    setModalView,
  } = useUI()

  const DropdownTrigger = isLoggedIn ? DropdownTriggerInst : React.Fragment

  return (
    <nav className={cn(s.root, className)}>
      <ul className={s.list}>
        <li className={s.item}>
          <Button
            className={s.item}
            variant="naked"
            onClick={() => {
              // setSidebarView('CART_VIEW')
              // toggleSidebar()
              router.push('/cart')
            }}
          >
            <Bag />
          </Button>
        </li>
        <li className={s.item}>
          <Dropdown>
            <DropdownTrigger>
              <a
                aria-label="Menu"
                className={s.avatarButton}
                onClick={() => {
                  if (isLoggedIn) return
                  setModalView('LOGIN_VIEW')
                  openModal()
                }}
              >
                <Avatar />
              </a>
            </DropdownTrigger>
            <CustomerMenuContent />
          </Dropdown>
        </li>
        <li className={s.mobileMenu}>
          <Button
            className={s.item}
            aria-label="Menu"
            variant="naked"
            onClick={() => {
              openSidebar()
              setSidebarView('MOBILE_MENU_VIEW')
            }}
          >
            <Menu />
          </Button>
        </li>
      </ul>
    </nav>
  )
}

export default UserNav
