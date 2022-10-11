import Editor from '@components/common/Editor'
import { Text } from '@components/ui'
import { ComponentConfig } from '../types'

interface EmailProps {
  subject: string
  template: string
  actionButtonText: string
}

const config: ComponentConfig<EmailProps> = {
  type: 'email',
  title: 'Email',
  Component: ({ subject, template }) => (
    <>
      <Text className="font-bold">Subject: </Text>
      {subject}
      <Text className="font-bold">Template:</Text>
      <Text html={template} />
    </>
  ),
  valuesDefinition: {
    subject: ['Subject', 'Email subject'],
    actionButtonText: ['Action button text (#action#)', 'Action'],
    template: ['Template', `#firstname# #lastname#`, Editor],
  },
}

export default config
