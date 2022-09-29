import Editor from '@components/common/Editor'
import { Text } from '@components/ui'
import { ComponentConfig } from '../types'

interface WysiwygProps {
  html?: string
}

const config: ComponentConfig<WysiwygProps> = {
  type: 'wysiwyg',
  title: 'Wysiwyg',
  Component: ({ html }) => {
    return <Text html={html} variant="wysiwyg" />
  },
  valuesDefinition: {
    html: [
      'HTML',
      `<ul>
          ${['scotty', "doesn't", 'know']
            .map((name) => `<li>${name}</li>`)
            .join('')}
       </ul>`,
      Editor,
    ],
  },
}

export default config
