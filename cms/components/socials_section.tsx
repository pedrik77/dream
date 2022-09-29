import SocialSection, {
  SocialSectionProps,
} from '@components/common/SocialSection/SocialSection'
import { Input } from 'cms/editors/input'
import { getMultiple } from 'cms/editors/multiple'
import { ComponentConfig } from '../types'

const config: ComponentConfig<SocialSectionProps> = {
  type: 'socials_section',
  title: 'Socials Section',
  Component: SocialSection,
  valuesDefinition: {
    title: ['Nadpis', 'SLEDUJTE NÁS'],
    links: [
      'Odkazy',
      ['https://www.facebook.com/'],
      getMultiple({ editor: Input, defaultValue: '' }),
    ],
  },
}

export default config
