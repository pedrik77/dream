import { useAdminWidget } from '@lib/api/cms/adminWidget'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

type WidgetLink = [label: string, href?: string, locale?: string]

const POSITION = 4.5

const className =
  'fixed cursor-pointer h-16 w-16 rounded-2xl z-40 text-xs hidden md:flex justify-center items-center text-center'

const activeBg = 'bg-secondary'
const inactiveBg = 'bg-primary border-2 border-secondary text-white'

function useMenu() {
  const { t } = useTranslation()

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
    [t('admin.titles.emails'), '/admin/emails'],
    // ['SK', , 'sk'],
    // ['EN', , 'en'],
  ]

  return { horizontal, vertical }
}

export default function AdminWidget() {
  const { t } = useTranslation()
  const {
    canShowWidget,
    isEditingMode,
    startEditing,
    stopEditing,
    isSavingNeeded,
  } = useAdminWidget()

  const [showMenu, setShowMenu] = useState(false)
  const timeoutRef = useRef<any>()

  if (!canShowWidget) return null

  return (
    <div
      className={`right-12 ${className} ${
        isEditingMode ? inactiveBg : activeBg
      }`}
      style={{ bottom: POSITION + 'rem' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          isEditingMode ? stopEditing() : startEditing()
        }
      }}
      onMouseEnter={() => {
        timeoutRef.current && clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(() => setShowMenu(true), 177)
      }}
      onMouseLeave={() => {
        timeoutRef.current && clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(() => setShowMenu(false), 277)
      }}
    >
      <Menu visible={showMenu} />
      {isEditingMode && isSavingNeeded && t('save')}
    </div>
  )
}

function Menu({ visible = false }) {
  const router = useRouter()
  const { horizontal, vertical } = useMenu()

  const [render, setRender] = useState(false)

  useEffect(() => {
    if (visible) return setRender(true)

    const id = setTimeout(() => setRender(false), 200)

    return () => clearTimeout(id)
  }, [visible])

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
