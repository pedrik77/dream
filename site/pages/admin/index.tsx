import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import Permit from '@components/common/Permit'
import { Button, Container, Text } from '@components/ui'
import { PERMISSIONS, useAuthContext } from '@lib/auth'
import Link from 'next/link'

export default function Dashboard() {
  const { user } = useAuthContext()

  return (
    <AdminLayout>
      <div className="flex">
        <Permit permission={PERMISSIONS.PRODUCTS_FORM}>
          <Button>
            <Link href="/admin/products/add">Pridať produkt</Link>
          </Button>
        </Permit>
      </div>
    </AdminLayout>
  )
}

Dashboard.Layout = Layout
