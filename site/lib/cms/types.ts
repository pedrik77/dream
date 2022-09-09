import wysiwyg from './getters/wysiwyg'
import pageBanner from './getters/page_banner'
import hero from './getters/hero'
import text from './getters/text'
import image from './getters/image'
import banner from './getters/banner'

export type ComponentType =
  | typeof wysiwyg.type
  | typeof banner.type
  | typeof pageBanner.type
  | typeof hero.type
  | typeof text.type
  | typeof image.type

export type ComponentConfig<T> = {
  type: string
  name: string
  Component: React.FC<T>
  Editor: (props: { setData: (data: T) => void } & T) => JSX.Element
  getStarter: () => StarterCommon<T>
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

export interface Settable {
  setData: (data: any) => void
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
    isMoving: boolean
    forceEdit?: boolean
    single?: boolean
  }
