import { ComponentType } from './types'

import Text from './getters/text'
import Image from './getters/image'
import Hero from './getters/hero'
import Banner from './getters/banner'
import PageBanner from './getters/page_banner'
import Wysiwyg from './getters/wysiwyg'

const COMPONENTS = {
  text: Text,
  wysiwyg: Wysiwyg,
  image: Image,
  hero: Hero,
  banner: Banner,
  page_banner: PageBanner,
}

function getComponentConfig(type: ComponentType) {
  return COMPONENTS[type]
}

export function getComponentSelectOptions({
  allowedComponents = [],
  forbiddenComponents = [],
}: { allowedComponents?: string[]; forbiddenComponents?: string[] } = {}) {
  const types = {}
  Object.entries(COMPONENTS).forEach(([key, value]) => {
    if (
      (allowedComponents.length && !allowedComponents.includes(key)) ||
      forbiddenComponents.includes(key)
    )
      return

    // @ts-ignore
    types[key] = value.name
  })

  return types
}

export const getComponentStarter = (componentType: ComponentType) =>
  getComponentConfig(componentType).getStarter()

export function getComponent(type: ComponentType) {
  return getComponentConfig(type).Component
}

export const getEditor = (componentType: ComponentType) =>
  getComponentConfig(componentType).Editor
