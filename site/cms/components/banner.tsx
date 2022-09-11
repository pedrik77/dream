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
    button: [
      'Button',
      {
        text: 'CHCEM VYHRAŤ',
        link: '/products/traktar-4000',
      },
      ({ value: button, onChange }) => {
        return (
          <>
            <Input
              label="Text buttonu"
              value={button.text || ''}
              onChange={(text) =>
                onChange({
                  ...button,
                  text,
                })
              }
            />
            <Input
              label="Smrevanie buttonu"
              value={button.link || ''}
              onChange={(link) =>
                onChange({
                  ...button,
                  link,
                })
              }
            />
          </>
        )
      },
    ],
    img: [
      'Image',
      '/assets/car_2560x1440.jpg',
      ({ value, onChange }) => {
        const ImageEditor = getEditor<ImageProps>('image', ['src'])
        return <ImageEditor src={value} setData={({ src }) => onChange(src)} />
      },
    ],
  },
}

export default config
