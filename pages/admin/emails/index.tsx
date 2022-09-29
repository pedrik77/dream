import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import Permit from '@components/common/Permit'
import { Text as UIText } from '@components/ui'
import { PERMISSIONS } from '@lib/auth'
import { ORDER_CREATED_CMS_ID } from '@lib/emails'
import { CMS } from 'cms'
import { Email } from 'cms/config'

export default function Emails() {
  return (
    <Permit permission={PERMISSIONS.EMAILS} redirect="/admin">
      <AdminLayout>
        <UIText variant="heading">Emaily</UIText>

        <CMS blockId={ORDER_CREATED_CMS_ID} single={Email} forceEdit />
      </AdminLayout>
    </Permit>
  )
}

Emails.Layout = Layout