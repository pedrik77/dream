import Editor from '@components/common/Editor'
import { Text } from '@components/ui'
import { ComponentConfig } from '../types'

interface EmailProps {
  subject: string
  template: string
}

const config: ComponentConfig<EmailProps> = {
  type: 'email',
  title: 'Email',
  Component: ({ subject, template }) => (
    <>
      <Text variant="sectionHeading">{subject}</Text>
      <Text html={template} />
    </>
  ),
  valuesDefinition: {
    subject: ['Subject', 'Email subject'],
    template: ['Template', `#name#`, Editor],
  },
}

export default config
