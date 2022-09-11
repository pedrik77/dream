import Banner, { BannerProps } from '@components/ui/Banner'
import { Input } from 'cms/editors/input'
import { getEditor } from 'cms/getters'
import { ComponentConfig } from '../types'
import { ImageProps } from './image'

const config: ComponentConfig<BannerProps> = {
  type: 'banner',
  title: 'Banner',
  Component: Banner,
  valuesDefinition: {
    primaryTitle: ['Hlavný nadpis', 'vysnivaj.si'],
    secondaryTitle: ['Hlavný nadpis 2', 'Traktar 4000'],
    subtitle: ['Podnadpis', 'Vyhrajte jedinečný Traktar 4000'],
    buttonText: ['Text buttonu', 'CHCEM VYHRAŤ'],
    buttonLink: ['Smrevanie buttonu', '/products/traktar-4000'],
    img: [
      'Image',
      '/assets/car_2560x1440.jpg',
      ({ value, onChange }) => {
        const ImageEditor = getEditor<ImageProps>('image', ['src'])
        return (
          <ImageEditor
            src={value}
            setData={({ src }) => onChange(src)}
            preview
          />
        )
      },
    ],
  },
}

export default config
