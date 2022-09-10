import { COMPONENTS } from './config'

type KeyOf<T> = keyof T

export type ComponentType = typeof COMPONENTS[number]['type']

export type EditorType<T = any, P = {}> = (
  props: P & {
    label?: string
    value: T
    onChange: (value: T) => void
  }
) => JSX.Element

export type Definition = [
  title: string,
  starter?: any,
  Editor?: string | EditorType
]

export type ValuesDefinition<T = {}> = Record<KeyOf<T>, Definition | false>

export type ComponentConfig<T> = {
  type: string
  title: string
  Component: React.FC<T>
  valuesDefinition: ValuesDefinition<T>
  Editor?: (props: Settable<T>) => JSX.Element
  loadStarterValues?: () => Promise<T>
  usePrompt?: KeyOf<T>[]
}

export interface StarterCommon<T = any> {
  type: ComponentType
  draft: boolean
  value: T
}

export type ComponentData = StarterCommon

export type CmsBlockData = {
  components: ComponentData[]
}

export interface Changeable {
  onChange: (value: any) => void
}

export type Settable<T = {}> = T & {
  setData: (data: T) => void
}

export interface ComponentsProps {
  blockId?: string
  children?: ComponentData[]
  forceEdit?: boolean
  forbidEdit?: boolean
  maxNumberOfComponents?: number
  allowedComponents?: string[]
  forbiddenComponents?: string[]
}

export type ChangableComponent = ComponentData &
  Changeable & {
    removeSelf: () => void
    toggleMoving: () => void
    toggleDraft: () => void
    isMoving: boolean
    forceEdit?: boolean
    single?: boolean
  }
