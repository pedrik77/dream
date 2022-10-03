import ContactForm, { ContactFormProps } from '@components/contact/ContactForm'
import { ComponentConfig } from '../types'

const config: ComponentConfig<ContactFormProps> = {
  type: 'contact_form',
  title: 'Contact Form',
  Component: ContactForm,
  valuesDefinition: {
    title: ['Title', 'Contact Us'],
  },
}

export default config
