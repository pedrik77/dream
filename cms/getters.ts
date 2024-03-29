import { page } from '@lib/api'
import { COMPONENTS as COMPONENTS_OBJ } from './config'
import {
  ComponentConfig,
  ComponentsLists,
  ComponentType,
  Settable,
} from './types'
import { createEditor } from './ui'

const COMPONENTS = Object.values(COMPONENTS_OBJ)

function getComponentConfig<T = any>(type: ComponentType): ComponentConfig<T> {
  const config = COMPONENTS.find((c) => c.type === type)

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
  COMPONENTS.forEach((config) => {
    if (
      (allowedComponents.length &&
        !allowedComponents.find((c) => c.type === config.type)) ||
      forbiddenComponents.find((c) => c.type === config.type)
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

          const [, starter = ''] = definition

          // @ts-ignore
          const value = values ? values[name] : starter

          return [
            name,
            (prompt &&
              // @ts-ignore
              prompt.includes(name) &&
              (await page.alerts.prompt(name, {
                cancelButtonText: 'Použiť predvolené',
                confirmButtonText: 'Pokračovať',
              }))) ||
              value,
          ]
        })
    )
  )

  const starter = {
    type: componentType,
    draft: false,
    value,
  }

  return starter
}

export const getComponent = (componentType: ComponentType) =>
  getComponentConfig(componentType).Component

export const getEditor = <T = any>(
  componentType: ComponentType,
  only: string[] = []
): ((props: Settable<T>) => JSX.Element) | null => {
  const { Editor, valuesDefinition } = getComponentConfig<T>(componentType)

  // @ts-ignore
  if (Editor) return Editor

  if (valuesDefinition === false) return null

  return createEditor<T>(valuesDefinition, only)
}
