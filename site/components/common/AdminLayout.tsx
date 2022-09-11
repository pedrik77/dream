import { Container } from '@components/ui'
import { PERMISSIONS } from '@lib/auth'
import Link from 'next/link'
import React from 'react'
import Permit from './Permit'

export default function AdminLayout({ children }: { children?: any }) {
  return (
    <Container className="grid lg:grid-cols-2 pt-4 gap-20">
      <div className="flex flex-col">
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

        <Permit permission={PERMISSIONS.MENU}>
          <Link href="/admin/menu">Menu</Link>
        </Permit>

        {/* <Permit permission={PERMISSIONS.USERS_LIST}>
                <Link href="/admin/users">Používatelia</Link>
              </Permit> */}

        {/* <Permit permission={PERMISSIONS.PAGES_LIST}>
                <Link href="/admin/pages">Stránky</Link>
              </Permit> */}
      </div>

      <div className="py-16">{children}</div>
    </Container>
  )
}
