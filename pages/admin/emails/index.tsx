import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import Permit from '@components/common/Permit'
import { Text } from '@components/ui'
import { PERMISSIONS } from '@lib/auth'
import {
  ORDER_CREATED_CMS_ID,
  PRODUCT_CLOSE_CMS_ID,
  VERIFICATION_CMS_ID,
} from '@lib/emails'
import { CMS } from 'cms'
import _ from 'lodash'

export default function Emails() {
  return (
    <Permit permission={PERMISSIONS.EMAILS} redirect="/admin">
      <AdminLayout>
        {[ORDER_CREATED_CMS_ID, VERIFICATION_CMS_ID, PRODUCT_CLOSE_CMS_ID].map(
          (id) => (
            <div key={id}>
              {console.log(id)}
              <Text variant="heading">{_.startCase(id)}</Text>
              <CMS blockId={id} single={CMS.Email} />
              <hr />
            </div>
          )
        )}
      </AdminLayout>
    </Permit>
  )
}

Emails.Layout = Layout
