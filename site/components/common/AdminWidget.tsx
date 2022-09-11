import { useAuthContext } from '@lib/auth'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const POSITION = 5

const className =
  'fixed cursor-pointer h-16 w-16 rounded-2xl z-50  text-xs hidden md:flex justify-center right-12'

const buttonBg = 'bg-primary border-2 border-secondary text-white'

export default function AdminWidget() {
  const { permissions, adminEditingMode, adminStartEditing, adminStopEditing } =
    useAuthContext()

  const [showMenu, setShowMenu] = useState(false)

  if (!permissions.length) return null

  return (
    <div
      className={`${className} ${adminEditingMode ? buttonBg : 'bg-secondary'}`}
      style={{ bottom: POSITION + 'rem' }}
      onClick={adminEditingMode ? adminStopEditing : adminStartEditing}
      onMouseEnter={() => setTimeout(() => setShowMenu(true), 100)}
      onMouseLeave={() => setTimeout(() => setShowMenu(false), 100)}
    >
      {showMenu && <Menu />}
    </div>
  )
}

function Menu() {
  const router = useRouter()

  const btns = [
    ['Admin', '/admin'],
    ['Menu', '/admin/menu'],
    ['Kategórie', '/admin/categories'],
    // ['Víťazi', '/admin/winners'],
    // ['Objednávky', '/admin/orders'],
    // ['Produkty', '/admin/products'],
    // ['Stránky', '/admin/pages'],
  ]

  const bottom = (key: number) => POSITION + (key + 1) * POSITION

  return (
    <>
      {btns.reverse().map(([label, href], i) => (
        <div
          key={href}
          className={` ${className} ${buttonBg}`}
          style={{ bottom: bottom(i) + 'rem' }}
          onClick={() => router.push(href)}
        >
          {label}
        </div>
      ))}
    </>
  )
}
