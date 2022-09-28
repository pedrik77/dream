import Banner, { BannerProps } from '@components/ui/Banner'
import { ComponentConfig } from '../types'
import { getImageInput } from 'cms/editors/input'

const config: ComponentConfig<BannerProps> = {
  type: 'banner',
  title: 'Banner',
  Component: Banner,
  valuesDefinition: {
    primaryTitle: ['Hlavný nadpis', 'vysnivaj.si'],
    secondaryTitle: ['Hlavný nadpis 2', 'Traktar 4000'],
    subtitle: ['Podnadpis', 'Vyhrajte jedinečný Traktar 4000'],
    // button: [
    //   'Button',
    //   '',
    //   {
    //     text: ['Text buttonu', 'CHCEM VYHRAŤ'],
    //     link: ['Smrevanie buttonu', '/products/traktar-4000'],
    //   },
    // ],
    buttonText: ['Text buttonu', 'CHCEM VYHRAŤ'],
    buttonLink: ['Smrevanie buttonu', '/products/traktar-4000'],
    img: [
      'labels.image',
      '/assets/car_2560x1440.jpg',
      // @ts-ignore
      getImageInput({ getPath: () => 'cms/banner' }),
    ],
  },
}

export default config
