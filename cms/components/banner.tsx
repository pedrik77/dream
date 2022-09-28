import Banner, { BannerProps } from '@components/ui/Banner'
import { ComponentConfig } from '../types'
import { getImageInput } from 'cms/editors/input'

const config: ComponentConfig<BannerProps> = {
  type: 'banner',
  title: 'Banner',
  Component: Banner,
  valuesDefinition: {
    primaryTitle: ['cms.banner.primaryTitle', 'vysnivaj.si'],
    secondaryTitle: ['cms.banner.secondaryTitle', 'Traktar 4000'],
    subtitle: ['cms.banner.subtitle', 'Vyhrajte jedinečný Traktar 4000'],
    buttonText: ['cms.banner.buttonText', 'CHCEM VYHRAŤ'],
    buttonLink: ['cms.banner.buttonLink', '/products/traktar-4000'],
    img: [
      ['cms.labels.image', 'cms.labels.banner'],
      '/assets/car_2560x1440.jpg',
      // @ts-ignore
      getImageInput({ getPath: () => 'cms/banner' }),
    ],
  },
}

export default config
