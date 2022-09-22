import { useAuthContext } from '@lib/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

type WidgetLink = [label: string, href?: string, locale?: string]

const POSITION = 4.5

const className =
  'fixed cursor-pointer h-16 w-16 rounded-2xl z-50 text-xs hidden md:flex justify-center items-center'

const activeBg = 'bg-secondary'
const inactiveBg = 'bg-primary border-2 border-secondary text-white'

export default function AdminWidget() {
  const { permissions, adminEditingMode, adminStartEditing, adminStopEditing } =
    useAuthContext()

  const [showMenu, setShowMenu] = useState(false)

  if (!permissions.length) return null

  return (
    <div
      className={`right-12 ${className} ${
        adminEditingMode ? inactiveBg : activeBg
      }`}
      style={{ bottom: POSITION + 'rem' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          adminEditingMode ? adminStopEditing() : adminStartEditing()
        }
      }}
      onMouseEnter={() => setTimeout(() => setShowMenu(true), 177)}
      onMouseLeave={() => setTimeout(() => setShowMenu(false), 177)}
    >
      {showMenu && <Menu />}
    </div>
  )
}

function Menu() {
  const router = useRouter()

  const horizontal: WidgetLink[] = [
    ['Admin', '/admin'],
    ['Kategórie', '/admin/categories'],
    ['Stránky', '/admin/pages'],
    ['Menu', '/admin/menu'],
    // ['Víťazi', '/admin/winners'],
    // ['Objednávky', '/admin/orders'],
    // ['Produkty', '/admin/products'],
  ]

  const vertical: WidgetLink[] = [
    ['Pridať produkt', '/admin/products/add'],
    ['SK', , 'sk'],
    ['EN', , 'en'],
  ]

  const isActive = ([
    label,
    href,
    locale = router.locale || '',
  ]: typeof vertical[number]) => {
    if (label.toLocaleLowerCase() === router.locale?.toLocaleLowerCase())
      return true

    if (href === router.asPath && locale === router.locale) return true

    return false
  }

  const bottom = (key: number) => POSITION + (key + 1) * POSITION

  return (
    <>
      {horizontal.reverse().map(([label, href = router.asPath, locale], i) => (
        <Link key={href} href={href} locale={locale}>
          <a
            className={`right-12 ${className} ${
              isActive([label, href, locale]) ? activeBg : inactiveBg
            }`}
            style={{ bottom: bottom(i) + 'rem' }}
          >
            {label}
          </a>
        </Link>
      ))}
      {vertical.map(([label, href = router.asPath, locale], i) => (
        <Link key={i} href={href} locale={locale}>
          <a
            className={`${className} ${
              isActive([label, href, locale]) ? activeBg : inactiveBg
            }`}
            style={{
              bottom: POSITION + 'rem',
              right: 7.5 + POSITION * i + 'rem',
            }}
          >
            {label}
          </a>
        </Link>
      ))}
    </>
  )
}
