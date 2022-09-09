import { Input } from '@components/ui'
import { ComponentConfig, Settable } from '../types'

const type = 'text'

const config: ComponentConfig<{ text: string }> = {
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

export function TextEditor({ text, setData }: { text: string } & Settable) {
  return (
    <div>
      <Input value={text} onChange={(text) => setData({ text })} />
    </div>
  )
}

export default config
