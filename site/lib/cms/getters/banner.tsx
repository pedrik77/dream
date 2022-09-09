import { Input } from '@components/ui'
import Banner, { BannerProps } from '@components/ui/Banner'
import { ComponentConfig, Settable } from '../types'
import Image from './image'

const type = 'banner'

const config: ComponentConfig<BannerProps> = {
  type,
  name: 'Banner',
  Component: Banner,
  Editor: BannerEditor,
  getStarter: () => ({
    type,
    draft: true,
    value: {
      primaryTitle: 'vysnivaj.si',
      secondaryTitle: 'Traktar 4000',
      subtitle: 'Vyhrajte jedinečný Traktar 4000',
      img: '/assets/car_2560x1440.jpg',
      button: {
        text: 'CHCEM VYHRAŤ',
        link: '/products/traktar-4000',
      },
    },
  }),
}

export function BannerEditor({
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
        pathBase="banners/"
        setData={({ src }) => setBanner({ ...banner, img: src })}
      />
    </>
  )
}

export default config
