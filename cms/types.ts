import { COMPONENTS_AVAILABLE } from './config'

type langs = 'sk' | 'en'

type KeyOf<T> = keyof T

type Translated<T> = Record<string, T>

export type ComponentType = typeof COMPONENTS_AVAILABLE[number]['type']

export type InputEditor<T = any, P = {}> = (
  props: P & {
    label?: string
    value: T
    onChange: (value: T) => void
    values?: Translated<T>
  }
) => JSX.Element

export type InputEditorGetter<T = any, P = {}> = (
  defaults?: P
) => InputEditor<T, P>

export type Definition<T> = [
  title: string | string[],
  starter?: any,
  Editor?:
    | string
    | string[]
    | string[][]
    | ValuesDefinition
    | InputEditor<any, T>
]

export type ValuesDefinition<T = {}> = Record<KeyOf<T>, Definition<T> | false>

export type ComponentConfig<T> = {
  type: string
  title: string
  Component: React.FC<T>
  valuesDefinition: ValuesDefinition<T>
  Editor?: (props: Settable<T>) => JSX.Element
  loadStarterValues?: () => Promise<T>
  prompt?: KeyOf<T>[]
}

export interface StarterCommon<T = any> {
  type: ComponentType
  draft: boolean
  value: T
  values?: Translated<T>
}

export interface Changeable {
  onChange: (value: any) => void
}

export type Settable<T = {}> = T & {
  onChange: (data: T) => void
}

export interface ComponentsLists {
  allowedComponents?: ComponentConfig<any>[]
  forbiddenComponents?: ComponentConfig<any>[]
}

export interface ComponentsProps extends ComponentsLists {
  blockId?: string
  children?: StarterCommon[]
  forceEdit?: boolean
  forbidEdit?: boolean
  maxNumberOfComponents?: number
  single?: ComponentConfig<any>
  onData?: (data: StarterCommon[]) => void
}

export type ChangableComponent = StarterCommon &
  Changeable & {
    removeSelf: () => void
    toggleMoving: () => void
    toggleDraft: () => void
    isHovering: boolean
    isMoving: boolean
    isEditing: boolean
    onEditing: (isEditing: boolean) => void
    forceEdit?: boolean
    single?: boolean
  }
