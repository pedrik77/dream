import { Dispatch, SetStateAction } from 'react'
import { COMPONENTS } from './config'

type KeyOf<T> = keyof T

export type ComponentType = typeof COMPONENTS[number]['type']

export type InputEditor<T = any, P = {}> = (
  props: P & {
    label?: string
    value: T
    onChange: (value: T) => void
    component?: P
  }
) => JSX.Element

export type InputEditorGetter<T = any, P = {}> = (
  defaults?: P
) => InputEditor<T, P>

export type Definition<T> = [
  title: string,
  starter?: any,
  Editor?: string | string[] | string[][] | InputEditor<any, T>
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
}

export interface Changeable {
  onChange: (value: any) => void
}

export type Settable<T = {}> = T & {
  setData: (data: T) => void
}

export interface ComponentsProps {
  blockId?: string
  children?: StarterCommon[]
  forceEdit?: boolean
  forbidEdit?: boolean
  maxNumberOfComponents?: number
  allowedComponents?: string[]
  forbiddenComponents?: string[]
}

export type ChangableComponent = StarterCommon &
  Changeable & {
    removeSelf: () => void
    toggleMoving: () => void
    toggleDraft: () => void
    isMoving: boolean
    isEditing: boolean
    onEditing: (isEditing: boolean) => void
    forceEdit?: boolean
    single?: boolean
  }
