import SocialSection, {
  SocialSectionProps,
} from '@components/common/SocialSection/SocialSection'
import { SocialsEditor } from 'cms/editors/socials_section'
import { ComponentConfig } from '../types'

const config: ComponentConfig<SocialSectionProps> = {
  type: 'socials_section',
  title: 'Socials Section',
  Component: SocialSection,
  valuesDefinition: {
    title: ['Nadpis', 'SLEDUJTE NÁS'],
    links: ['Odkazy', ['https://www.facebook.com/'], SocialsEditor],
  },
}

export default config
