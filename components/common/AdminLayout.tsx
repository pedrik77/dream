import { Container } from '@components/ui'
import { PERMISSIONS } from '@lib/auth'
import Link from 'next/link'
import React from 'react'
import Permit from './Permit'

export default function AdminLayout({ children }: { children?: any }) {
  return (
    <Container className="pt-4 mt-0 md:mt-8">
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
        <div className="lg:w-1/4 flex flex-col gap-4 sm:pr-4 pb-8 mx-2 lg:mx-4 items-start justify-center md:justify-start text-lg lg:text-2xl uppercase text-center">
          {/* <Permit permission={PERMISSIONS.ORDERS_LIST}>
          <Link href="/admin/orders">Objednávky</Link>
        </Permit> */}

          {/* <Permit permission={PERMISSIONS.WINNERS_LIST}>
                <Link href="/admin/winners">Víťazi</Link>
              </Permit> */}

          <Permit permission={PERMISSIONS.PRODUCTS_LIST}>
            <Link href="/admin/products">Produkty</Link>
          </Permit>

          <Permit permission={PERMISSIONS.CATEGORIES_LIST}>
            <Link href="/admin/categories">Kategórie</Link>
          </Permit>

          <Permit permission={PERMISSIONS.MENU_LIST}>
            <Link href="/admin/menu">Menu</Link>
          </Permit>

          {/* <Permit permission={PERMISSIONS.USERS_LIST}>
                <Link href="/admin/users">Používatelia</Link>
              </Permit> */}

          <Permit permission={PERMISSIONS.PAGES_LIST}>
            <Link href="/admin/pages">Stránky</Link>
          </Permit>
        </div>

        <div className="w-full">{children}</div>
      </div>
    </Container>
  )
}
