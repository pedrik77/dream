import { ComponentType } from './types'

import Text from './components/text'
import Image from './components/image'
import Hero from './components/hero'
import Banner from './components/banner'
import PageBanner from './components/page_banner'
import Wysiwyg from './components/wysiwyg'
import Carousel from './components/carousel'

export const COMPONENTS = [
  Wysiwyg,
  Text,
  Image,
  Hero,
  PageBanner,
  Banner,
  Carousel,
]

function getComponentConfig(type: ComponentType) {
  const config = COMPONENTS.find((c) => c.type === type)

  if (config) return config

  console.log({ type, config })

  throw new Error(`Component type ${type} not found`)
}

export function getComponentSelectOptions({
  allowedComponents = [],
  forbiddenComponents = [],
}: { allowedComponents?: string[]; forbiddenComponents?: string[] } = {}) {
  const types = {}
  COMPONENTS.forEach((config) => {
    if (
      (allowedComponents.length && !allowedComponents.includes(config.type)) ||
      forbiddenComponents.includes(config.type)
    )
      return

    // @ts-ignore
    types[config.type] = config.name
  })

  return types
}

export const getComponentStarter = (componentType: ComponentType) =>
  getComponentConfig(componentType).getStarter()

export const getComponent = (componentType: ComponentType) =>
  getComponentConfig(componentType).Component

export const getEditor = (componentType: ComponentType) =>
  getComponentConfig(componentType).Editor
