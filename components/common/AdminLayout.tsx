import { Container } from '@components/ui'
import { PERMISSIONS } from '@lib/auth'
import Link from 'next/link'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Permit from './Permit'

export default function AdminLayout({ children }: { children?: any }) {
  const { t } = useTranslation()
  return (
    <Container className="pt-4 mt-0 md:mt-8">
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
        <div className="lg:w-1/4 flex flex-col gap-4 sm:pr-4 pb-8 mx-2 lg:mx-4 items-start justify-center md:justify-start text-lg lg:text-2xl uppercase text-center">
          {/* <Permit permission={PERMISSIONS.ORDERS_LIST}>
          <Link href="/admin/orders">{t('admin.titles.users')}</Link>
        </Permit> */}
          {/* <Permit permission={PERMISSIONS.WINNERS_LIST}>
                <Link href="/admin/winners">t('admin.titles.winners')</Link>
              </Permit> */}

          <Permit permission={PERMISSIONS.PRODUCTS_LIST}>
            <Link href="/admin/products">{t('admin.titles.products')}</Link>
          </Permit>
          <Permit permission={PERMISSIONS.CATEGORIES_LIST}>
            <Link href="/admin/categories">{t('admin.titles.categories')}</Link>
          </Permit>
          <Permit permission={PERMISSIONS.MENU_LIST}>
            <Link href="/admin/menu">Menu</Link>
          </Permit>
          {/* <Permit permission={PERMISSIONS.USERS_LIST}>
                <Link href="/admin/users">t('admin.titles.users')</Link>
              </Permit> */}
          <Permit permission={PERMISSIONS.PAGES_LIST}>
            <Link href="/admin/pages">{t('admin.titles.pages')}</Link>
          </Permit>
          <Permit permission={PERMISSIONS.EMAILS}>
            <Link href="/admin/emails">{t('admin.titles.emails')}</Link>
          </Permit>
        </div>

        <div className="w-full">{children}</div>
      </div>
    </Container>
  )
}
