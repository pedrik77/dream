import { Layout } from '@components/common'
import { Button, Container, Text } from '@components/ui'
import { useAdmin } from '@lib/auth'
import Link from 'next/link'

export default function Dashboard() {
  const { isAdmin, hasPermission } = useAdmin()

  if (!isAdmin) return null

  return (
    <div>
      <Container className="grid lg:grid-cols-2 pt-4 gap-20">
        <div className="flex flex-col">
          <Link href="/admin/orders">Objednávky</Link>
          <Link href="/admin/users">Používatelia</Link>
          <Link href="/admin/products">Produkty</Link>
          <Link href="/admin/winners">Víťazi</Link>
          <Link href="/admin/pages">Stránky</Link>
        </div>

        <div>
          <Text variant="heading">Vitaj ty</Text>

          <div className="flex">
            <Button>
              <Link href="/admin/products/add">Pridať produkt</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

Dashboard.Layout = Layout
