import { ComponentType } from './types'

import Text from './getters/text'
import Image from './getters/image'
import Hero from './getters/hero'
import Banner from './getters/banner'
import PageBanner from './getters/page_banner'
import Wysiwyg from './getters/wysiwyg'

export const COMPONENTS = [Text, Image, Hero, Banner, PageBanner, Wysiwyg]

function getComponentConfig(type: ComponentType) {
  const config = COMPONENTS.find((c) => c.type === type)

  if (config) return config

  throw new Error(`Component type ${type} not found`)
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

export const getComponent = (type: ComponentType) =>
  getComponentConfig(type).Component

export const getEditor = (componentType: ComponentType) =>
  getComponentConfig(componentType).Editor
