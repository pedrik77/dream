import Text from './components/text'
import Image from './components/image'
import Hero from './components/hero'
import Banner from './components/banner'
import PageBanner from './components/page_banner'
import Wysiwyg from './components/wysiwyg'
import Carousel from './components/carousel'
import Spacer from './components/spacer'
import LogosSection from './components/logos_section'
import Socials from './components/socials_section'

export const COMPONENTS = [
  Wysiwyg,
  Text,
  Image,
  Hero,
  PageBanner,
  Banner,
  Carousel,
  LogosSection,
  Socials,
  Spacer,
]

export const DEFAULT_FORBIDDEN = [Text.type]
export const DEFAULT_ALLOWED = []

export const config = {
  Wysiwyg,
  Text,
  Image,
  Hero,
  PageBanner,
  Banner,
  Carousel,
  LogosSection,
  Socials,
  Spacer,
}
