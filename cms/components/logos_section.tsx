import LogosSection, {
  LogosSectionProps,
} from '@components/ui/LogosSection/LogosSection'
import { LogosEditor } from 'cms/editors/logos_section'
import { ComponentConfig } from '../types'

const config: ComponentConfig<LogosSectionProps> = {
  type: 'logos_section',
  title: 'Logos Section',
  Component: LogosSection,
  valuesDefinition: {
    heading: ['title', 'Partneri'],
    width: ['width', 180, 'number'],
    height: ['height', 60, 'number'],
    imgs: [
      ['cms.labels.images', 'cms.labels.logosSection'],
      Array(4).fill('/logo2.png'),
      LogosEditor,
    ],
  },
}

export default config
