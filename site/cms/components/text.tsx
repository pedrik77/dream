import { ComponentConfig } from '../types'

type TextProps = {
  text: string
}

const type = 'text'

const config: ComponentConfig<TextProps> = {
  type,
  title: 'Text',
  Component: ({ text = '' }) => <div>{text}</div>,
  valuesDefinition: {
    text: ['Text', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'],
  },
}

export default config
