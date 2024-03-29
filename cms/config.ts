import { ComponentConfig } from './types'
import Text from './components/text'
import Image from './components/image'
import Hero from './components/hero'
import Banner from './components/banner'
import PageBanner from './components/page_banner'
import Wysiwyg from './components/wysiwyg'
import ContaineredWysiwyg from './components/containered_wysiwyg'
import Carousel from './components/carousel'
import Spacer from './components/spacer'
import Email from './components/email'
import Tickets from './components/tickets'
import LogosSection from './components/logos_section'
import Socials from './components/socials_section'
import ContactForm from './components/contact_form'

const COMPONENTS = {
  Wysiwyg,
  ContaineredWysiwyg,
  ContactForm,
  Text,
  Image,
  Email,
  Tickets,
  Hero,
  PageBanner,
  Banner,
  Carousel,
  LogosSection,
  Socials,
  Spacer,
}

const DEFAULT_FORBIDDEN: ComponentConfig<any>[] = []
const DEFAULT_ALLOWED: ComponentConfig<any>[] = [
  Wysiwyg,
  Image,
  Hero,
  PageBanner,
  Banner,
  Carousel,
  LogosSection,
  Socials,
  Spacer,
]

export { COMPONENTS, DEFAULT_FORBIDDEN, DEFAULT_ALLOWED }
