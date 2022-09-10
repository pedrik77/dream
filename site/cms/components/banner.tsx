import { Input } from '@components/ui'
import Banner, { BannerProps } from '@components/ui/Banner'
import { ComponentConfig, Settable } from '../types'
import Image from './image'

const type = 'banner'

const config: ComponentConfig<BannerProps> = {
  type,
  title: 'Banner',
  Component: Banner,
  Editor: BannerEditor,
  valuesDefinition: {
    primaryTitle: ['Hlavný nadpis', 'vysnivaj.si'],
    secondaryTitle: ['Hlavný nadpis 2', 'Traktar 4000'],
    subtitle: ['Podnadpis', 'Vyhrajte jedinečný Traktar 4000'],
    img: ['Image', '/assets/car_2560x1440.jpg'],
    button: [
      'Button',
      {
        text: 'CHCEM VYHRAŤ',
        link: '/products/traktar-4000',
      },
    ],
  },
}

function BannerEditor({
  setData: setBanner,
  ...banner
}: Settable<BannerProps>) {
  return (
    <>
      <Input
        variant="cms"
        value={banner.primaryTitle}
        onChange={(primaryTitle) => setBanner({ ...banner, primaryTitle })}
      />
      <Input
        variant="cms"
        value={banner.secondaryTitle}
        onChange={(secondaryTitle) => setBanner({ ...banner, secondaryTitle })}
      />
      <Input
        variant="cms"
        value={banner.button?.text || ''}
        onChange={(text) =>
          setBanner({
            ...banner,
            button: { link: '', ...banner.button, text },
          })
        }
      />
      <Input
        variant="cms"
        value={banner.button?.link || ''}
        onChange={(link) =>
          setBanner({ ...banner, button: { text: '', ...banner.button, link } })
        }
      />
      <Input variant="cms" value={banner.img} readOnly />
      <Image.Editor
        src={banner.img}
        onlySrc
        pathBase="banners/"
        setData={({ src }) => setBanner({ ...banner, img: src })}
      />
    </>
  )
}

export default config
