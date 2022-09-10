import { Input } from '@components/ui'

import { ComponentConfig, Settable } from '../types'

type TextProps = {
  text: string
}

const type = 'text'

const config: ComponentConfig<TextProps> = {
  type,
  name: 'Text',
  Component: ({ text = '' }) => <div>{text}</div>,
  Editor: ({ text, setData }) => (
    <div>
      <Input value={text} onChange={(text) => setData({ text })} />
    </div>
  ),
  getStarter: async () => ({
    type,
    draft: true,
    value: {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  }),
  labels: {
    text: [
      'Text',
      { starter: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    ],
  },
}

export default config
