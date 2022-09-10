import Editor from '@components/common/Editor'
import { Text } from '@components/ui'
import { ComponentConfig, Settable } from '../types'

const type = 'wysiwyg'

interface WysiwygProps {
  html?: string
}

const config: ComponentConfig<WysiwygProps> = {
  type,
  name: 'Wysiwyg',
  Component: Text,
  Editor: ({ html, setData }) => (
    // @ts-ignore
    <Editor value={html} onChange={(html) => setData({ html })} />
  ),
  getStarter: async () => ({
    type,
    draft: true,
    value: {
      html: `
        <ul>
          ${['scotty', "doesn't", 'know']
            .map((name) => `<li>${name}</li>`)
            .join('')}
        </ul>
        `,
    },
  }),
}

export default config
