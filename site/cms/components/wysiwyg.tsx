import Editor from '@components/common/Editor'
import { Text } from '@components/ui'
import { ComponentConfig } from '../types'

interface WysiwygProps {
  html?: string
}

const config: ComponentConfig<WysiwygProps> = {
  type: 'wysiwyg',
  title: 'Wysiwyg',
  Component: Text,
  valuesDefinition: {
    html: [
      'HTML',
      `<ul>
          ${['scotty', "doesn't", 'know']
            .map((name) => `<li>${name}</li>`)
            .join('')}
       </ul>`,
      ({ value, onChange }) => <Editor value={value} onChange={onChange} />,
    ],
  },
}

export default config
