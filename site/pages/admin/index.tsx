import { Layout } from '@components/common'
import AdminPermit from '@components/magic/AdminPermit'
import { Button, Container, Text } from '@components/ui'
import { PERMISSIONS, useUser } from '@lib/auth'
import { usePermission } from '@lib/hooks/usePermission'
import Link from 'next/link'

export default function Dashboard() {
  const { user } = useUser()

  if (!usePermission()) return null

  return (
    <div>
      <Container className="grid lg:grid-cols-2 pt-4 gap-20">
        <div className="flex flex-col">
          <AdminPermit permission={PERMISSIONS.ORDERS_LIST}>
            <Link href="/admin/orders">Objednávky</Link>
          </AdminPermit>

          <AdminPermit permission={PERMISSIONS.USERS_LIST}>
            <Link href="/admin/users">Používatelia</Link>
          </AdminPermit>

          <AdminPermit permission={PERMISSIONS.CATEGORIES_LIST}>
            <Link href="/admin/categories">Kategórie</Link>
          </AdminPermit>

          <AdminPermit permission={PERMISSIONS.PRODUCTS_LIST}>
            <Link href="/admin/products">Produkty</Link>
          </AdminPermit>

          <AdminPermit permission={PERMISSIONS.WINNERS_LIST}>
            <Link href="/admin/winners">Víťazi</Link>
          </AdminPermit>

          <AdminPermit permission={PERMISSIONS.PAGES_LIST}>
            <Link href="/admin/pages">Stránky</Link>
          </AdminPermit>
        </div>

        <div>
          <Text variant="heading">Vitaj {user?.email ?? 'ty'}</Text>

          <div className="flex">
            <AdminPermit permission={PERMISSIONS.PRODUCTS_ADD}>
              <Button>
                <Link href="/admin/products/add">Pridať produkt</Link>
              </Button>
            </AdminPermit>
          </div>
        </div>
      </Container>
    </div>
  )
}

Dashboard.Layout = Layout
