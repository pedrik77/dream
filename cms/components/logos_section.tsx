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
    heading: ['Nadpis', 'Partneri'],
    width: ['Šírka', 180, 'number'],
    height: ['Výška', 60, 'number'],
    imgs: ['Logá', Array(4).fill('/logo2.png'), LogosEditor],
  },
}

export default config
