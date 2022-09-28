import { useAuthContext } from '@lib/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type WidgetLink = [label: string, href?: string, locale?: string]

const POSITION = 4.5

const className =
  'fixed cursor-pointer h-16 w-16 rounded-2xl z-50 text-xs hidden md:flex justify-center items-center text-center'

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
      <Menu visible={showMenu} />
    </div>
  )
}

function Menu({ visible = false }) {
  const router = useRouter()
  const { t } = useTranslation()

  const [render, setRender] = useState(false)

  useEffect(() => {
    if (visible) return setRender(true)

    const id = setTimeout(() => setRender(false), 200)

    return () => clearTimeout(id)
  }, [visible])

  const horizontal: WidgetLink[] = [
    [t('admin.titles.main'), '/admin'],
    [t('admin.titles.categories'), '/admin/categories'],
    [t('admin.titles.pages'), '/admin/pages'],
    ['Menu', '/admin/menu'],
    // ['Víťazi', '/admin/winners'],
    // ['Objednávky', '/admin/orders'],
    // ['Produkty', '/admin/products'],
  ]

  const vertical: WidgetLink[] = [
    [t('admin.addNewProduct'), '/admin/products/add'],
    [t('admin.titles.products'), '/admin/products'],
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

  const animate = 'transition-all duration-300 ease-in-out'

  if (!render) return null

  return (
    <>
      {horizontal.reverse().map(([label, href = router.asPath, locale], i) => (
        <Link key={href} href={href} locale={locale}>
          <a
            className={`right-12 ${className} ${animate} ${
              isActive([label, href, locale]) ? activeBg : inactiveBg
            }`}
            style={{ bottom: bottom(i) + 'rem', opacity: visible ? 1 : 0 }}
          >
            {label}
          </a>
        </Link>
      ))}
      {vertical.map(([label, href = router.asPath, locale], i) => (
        <Link key={i} href={href} locale={locale}>
          <a
            className={`${className} ${animate} ${
              isActive([label, href, locale]) ? activeBg : inactiveBg
            }`}
            style={{
              bottom: POSITION + 'rem',
              right: 7.5 + POSITION * i + 'rem',
              opacity: visible ? 1 : 0,
            }}
          >
            {label}
          </a>
        </Link>
      ))}
    </>
  )
}
