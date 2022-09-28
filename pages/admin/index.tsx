import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import Permit from '@components/common/Permit'
import { Button, Container, Text } from '@components/ui'
import { PERMISSIONS, useAuthContext } from '@lib/auth'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { user } = useAuthContext()
  const { t } = useTranslation()

  return (
    <Permit permission={PERMISSIONS.ADMIN} redirect="/">
      <AdminLayout>
        <div className="flex flex-col gap-4">
          <Text variant="heading">
            {t('welcome')} {user?.email ?? 'ty'}
          </Text>
          <Permit permission={PERMISSIONS.PRODUCTS_FORM}>
            <Button className="w-fit">
              <Link href="/admin/products/add">{t('admin.addNewProduct')}</Link>
            </Button>
          </Permit>
        </div>
      </AdminLayout>
    </Permit>
  )
}

Dashboard.Layout = Layout
