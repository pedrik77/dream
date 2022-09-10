import { Input } from '@components/ui'

import { ComponentConfig, Settable } from '../types'

type TextProps = {
  text: string
}

const type = 'text'

const config: ComponentConfig<TextProps> = {
  type,
  title: 'Text',
  Component: ({ text = '' }) => <div>{text}</div>,
  Editor: ({ text, setData }) => (
    <div>
      <Input value={text} onChange={(text) => setData({ text })} />
    </div>
  ),
  valuesDefinition: {
    text: ['Text', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'],
  },
}

export default config
