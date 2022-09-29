import { ComponentConfig } from './types'
import Text from './components/text'
import Image from './components/image'
import Hero from './components/hero'
import Banner from './components/banner'
import PageBanner from './components/page_banner'
import Wysiwyg from './components/wysiwyg'
import Carousel from './components/carousel'
import Spacer from './components/spacer'
import Email from './components/email'
import LogosSection from './components/logos_section'
import Socials from './components/socials_section'

const COMPONENTS_AVAILABLE = [
  Wysiwyg,
  Text,
  Image,
  Email,
  Hero,
  PageBanner,
  Banner,
  Carousel,
  LogosSection,
  Socials,
  Spacer,
]

const DEFAULT_FORBIDDEN: ComponentConfig<any>[] = [Text, Email]
const DEFAULT_ALLOWED: ComponentConfig<any>[] = []

export {
  COMPONENTS_AVAILABLE,
  DEFAULT_FORBIDDEN,
  DEFAULT_ALLOWED,
  Wysiwyg,
  Text,
  Email,
  Image,
  Hero,
  PageBanner,
  Banner,
  Carousel,
  LogosSection,
  Socials,
  Spacer,
}
