import { COMPONENTS } from './config'

type langs = 'sk' | 'en'

type KeyOf<T> = keyof T

type Translated<T> = Record<string, T>

export type ComponentNameType = KeyOf<typeof COMPONENTS>

export type ComponentType = typeof COMPONENTS[ComponentNameType]['type']

export type InputEditor<T = any, P = {}> = (
  props: Changeable<T> &
    P & {
      label?: string
      value: T
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

export type ValuesDefinition<T = {}> =
  | Record<KeyOf<T>, Definition<T> | false>
  | false

export type ComponentConfig<T> = {
  type: string
  title: string
  Component: React.FC<T>
  valuesDefinition: ValuesDefinition<T>
  css?: boolean
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

export interface Changeable<T = any> {
  onChange: (value: T) => void
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
