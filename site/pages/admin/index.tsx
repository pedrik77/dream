import { Layout } from '@components/common'
import AdminPermit from '@components/magic/AdminPermit'
import { Button, Container, Text } from '@components/ui'
import { useUser } from '@lib/auth'
import Link from 'next/link'

export default function Dashboard() {
  const { isAdmin, user } = useUser()

  if (!isAdmin) return null

  return (
    <div>
      <Container className="grid lg:grid-cols-2 pt-4 gap-20">
        <div className="flex flex-col">
          <AdminPermit permission="orders.list">
            <Link href="/admin/orders">Objednávky</Link>
          </AdminPermit>

          <AdminPermit permission="users.list">
            <Link href="/admin/users">Používatelia</Link>
          </AdminPermit>

          <AdminPermit permission="products.list">
            <Link href="/admin/products">Produkty</Link>
          </AdminPermit>

          <AdminPermit permission="winners.list">
            <Link href="/admin/winners">Víťazi</Link>
          </AdminPermit>

          <AdminPermit permission="pages.list">
            <Link href="/admin/pages">Stránky</Link>
          </AdminPermit>
        </div>

        <div>
          <Text variant="heading">Vitaj {user?.email ?? 'ty'}</Text>

          <div className="flex">
            <AdminPermit permission="products.add">
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
