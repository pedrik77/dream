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
  Editor: TextEditor,
  getStarter: () => ({
    type,
    draft: true,
    value: {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  }),
}

function TextEditor({ text, setData }: Settable<TextProps>) {
  return (
    <div>
      <Input value={text} onChange={(text) => setData({ text })} />
    </div>
  )
}

export default config
