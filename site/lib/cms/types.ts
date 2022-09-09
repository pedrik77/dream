import { getComponentStarter } from './ui'

const TextStarter = getComponentStarter('text')
const WysiwygStarter = getComponentStarter('wysiwyg')
const BannerStarter = getComponentStarter('banner')
const PageBannerStarter = getComponentStarter('page-banner')
const ImageStarter = getComponentStarter('image')
const HeroStarter = getComponentStarter('hero')

export type ComponentData =
  | typeof TextStarter
  | typeof WysiwygStarter
  | typeof BannerStarter
  | typeof PageBannerStarter
  | typeof ImageStarter
  | typeof HeroStarter

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
