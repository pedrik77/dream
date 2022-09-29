import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import Permit from '@components/common/Permit'
import { Text as UIText } from '@components/ui'
import { PERMISSIONS } from '@lib/auth'
import { ORDER_CREATED_CMS_ID } from '@lib/emails'
import { CMS } from 'cms'

export default function Emails() {
  return (
    <Permit permission={PERMISSIONS.EMAILS} redirect="/admin">
      <AdminLayout>
        <UIText variant="heading">Emaily</UIText>
        {[ORDER_CREATED_CMS_ID].map((id) => (
          <CMS key={id} blockId={id} single={CMS.Email} />
        ))}
      </AdminLayout>
    </Permit>
  )
}

Emails.Layout = Layout
