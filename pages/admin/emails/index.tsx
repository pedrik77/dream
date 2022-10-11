import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import Permit from '@components/common/Permit'
import { Text } from '@components/ui'
import { PERMISSIONS } from '@lib/auth'
import { templates } from '@lib/emails'
import { CMS } from 'cms'
import { startCase } from 'lodash'

export default function Emails() {
  return (
    <Permit permission={PERMISSIONS.EMAILS} redirect="/admin">
      <AdminLayout>
        {Object.entries(templates).map(([id, placeholders]) => (
          <div key={id}>
            <Text variant="sectionHeading">
              {startCase(id.replace('email', ''))}
            </Text>
            <Text className="font-bold">Placeholders:</Text>
            {placeholders.map((p) => `#${p}#`).join(', ')}
            <CMS blockId={id} single={CMS.Email} forceEdit={false} />
            <hr className="my-4" />
          </div>
        ))}
      </AdminLayout>
    </Permit>
  )
}

Emails.Layout = Layout
