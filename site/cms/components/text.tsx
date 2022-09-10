import { ComponentConfig } from '../types'

type TextProps = {
  text: string
}

const config: ComponentConfig<TextProps> = {
  type: 'text',
  title: 'Text',
  Component: ({ text = '' }) => <div>{text}</div>,
  valuesDefinition: {
    text: ['Text', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'],
  },
}

export default config
