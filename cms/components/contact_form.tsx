import ContactForm from '@components/contact/ContactForm'
import { ComponentConfig } from '../types'

const config: ComponentConfig<{}> = {
  type: 'contact_form',
  title: 'Contact Form',
  Component: ContactForm,
  valuesDefinition: false,
}

export default config
