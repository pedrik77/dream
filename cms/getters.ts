import { prompt as promptValue } from '@lib/alerts'
import { COMPONENTS_AVAILABLE } from './config'
import {
  ComponentConfig,
  ComponentsLists,
  ComponentType,
  Settable,
} from './types'
import { createEditor } from './ui'

function getComponentConfig<T = any>(type: ComponentType): ComponentConfig<T> {
  const config = COMPONENTS_AVAILABLE.find((c) => c.type === type)

  // @ts-ignore
  if (config) return config

  throw new Error(`Component type ${type} not found`)
}

export function getComponentTitle(type: ComponentType): string {
  return getComponentConfig(type).title
}

export function getComponentSelectOptions({
  allowedComponents = [],
  forbiddenComponents = [],
}: ComponentsLists = {}) {
  const types = {}
  COMPONENTS_AVAILABLE.forEach((config) => {
    if (
      (allowedComponents.length &&
        !allowedComponents.find((c) => c.type === config.type)) ||
      (forbiddenComponents.find((c) => c.type === config.type) &&
        !allowedComponents.find((c) => c.type === config.type))
    )
      return

    // @ts-ignore
    types[config.type] = config.title
  })

  return types
}

export const getComponentStarter = async (componentType: ComponentType) => {
  const { valuesDefinition, loadStarterValues, prompt } =
    getComponentConfig(componentType)

  const values = loadStarterValues ? await loadStarterValues() : null

  const value = Object.fromEntries(
    await Promise.all(
      Object.entries(valuesDefinition)
        .filter(([, definition]) => !!definition)
        .map(async ([name, definition]) => {
          if (definition === false) throw new Error('Should not happen')

          const [title = '', starter = ''] = definition

          // @ts-ignore
          const value = values ? values[name] : starter

          return [
            name,
            (prompt &&
              // @ts-ignore
              prompt.includes(name) &&
              (await promptValue(title, {
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

export const getEditor = <T = any>(
  componentType: ComponentType,
  only: string[] = []
): ((props: Settable<T>) => JSX.Element) => {
  const { Editor, valuesDefinition } = getComponentConfig<T>(componentType)

  // @ts-ignore
  if (Editor) return Editor

  return createEditor<T>(valuesDefinition, only)
}
