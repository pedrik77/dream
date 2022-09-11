import { ComponentConfig } from '../types'

type TextProps = {
  text: string
}

const config: ComponentConfig<TextProps> = {
  type: 'text',
  title: 'Text',
  Component: ({ text = '' }) => <>{text}</>,
  valuesDefinition: {
    text: ['Text', 'Lorem'],
  },
}

export default config
