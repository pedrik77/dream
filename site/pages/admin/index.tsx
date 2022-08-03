import { Layout } from '@components/common'
import Permit from '@components/common/Permit'
import { Button, Container, Text } from '@components/ui'
import { PERMISSIONS, useAuthContext } from '@lib/auth'
import { usePermission } from '@lib/hooks/usePermission'
import Link from 'next/link'

export default function Dashboard() {
  const { user } = useAuthContext()

  if (!usePermission()) return null

  return (
    <div>
      <Container className="grid lg:grid-cols-2 pt-4 gap-20">
        <div className="flex flex-col">
          <Permit permission={PERMISSIONS.ORDERS_LIST}>
            <Link href="/admin/orders">Objednávky</Link>
          </Permit>

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

        <div>
          <Text variant="heading">Vitaj {user?.email ?? 'ty'}</Text>

          <div className="flex">
            <Permit permission={PERMISSIONS.PRODUCTS_ADD}>
              <Button>
                <Link href="/admin/products/add">Pridať produkt</Link>
              </Button>
            </Permit>
          </div>
        </div>
      </Container>
    </div>
  )
}

Dashboard.Layout = Layout
