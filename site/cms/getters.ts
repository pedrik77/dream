import { prompt } from '@lib/alerts'
import { COMPONENTS } from '.'
import { ComponentType } from './types'

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
  COMPONENTS.forEach((config) => {
    if (
      (allowedComponents.length && !allowedComponents.includes(config.type)) ||
      forbiddenComponents.includes(config.type)
    )
      return

    // @ts-ignore
    types[config.type] = config.title
  })

  return types
}

export const getComponentStarter = async (componentType: ComponentType) => {
  const { valuesDefinition, loadStarterValues } =
    getComponentConfig(componentType)

  const values = loadStarterValues ? await loadStarterValues() : null

  const value = Object.fromEntries(
    await Promise.all(
      Object.entries(valuesDefinition)
        .filter(([, definition]) =>
          definition === false || definition[2]?.hide ? false : true
        )
        .map(async ([name, d]) => {
          if (d === false) throw new Error('Should not happen')

          const [title = '', starter = '', options] = d

          // @ts-ignore
          const value = values ? values[name] : starter
          console.log({ d })

          return [
            name,
            (options?.usePrompt &&
              (await prompt(title, {
                cancelButton: 'Použiť predvolené',
                confirmButton: 'Pokračovať',
              }))) ||
              value,
          ]
        })
    )
  )

  const starter = {
    type: componentType,
    draft: true,
    value,
  }

  return starter
}

export const getComponent = (componentType: ComponentType) =>
  getComponentConfig(componentType).Component

export const getEditor = (componentType: ComponentType) =>
  getComponentConfig(componentType).Editor
