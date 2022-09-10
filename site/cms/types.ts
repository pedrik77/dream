import { COMPONENTS } from '.'

export type ComponentType = typeof COMPONENTS[number]['type']

export type Label =
  | [
      title: string,
      options: { starter?: string; prompt?: boolean; hide?: boolean }
    ]
  | string

export type ComponentConfig<T> = {
  type: string
  name: string
  Component: React.FC<T>
  Editor: (props: Settable<T>) => JSX.Element
  getStarter: () => Promise<StarterCommon<T>>
  labels: Record<keyof T, Label>
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

export type Settable<T = any> = T & {
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
