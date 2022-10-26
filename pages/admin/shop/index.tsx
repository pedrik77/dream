import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import Permit from '@components/common/Permit'
import { PERMISSIONS } from '@lib/api/page/auth'
import { TICKETS_CMS_ID } from '@lib/api/shop'
import { CMS } from 'cms'

export default function Shop() {
  return (
    <Permit permission={PERMISSIONS.SHOP} redirect="/admin">
      <AdminLayout>
        <CMS blockId={TICKETS_CMS_ID} single={CMS.Tickets} />
      </AdminLayout>
    </Permit>
  )
}

Shop.Layout = Layout
