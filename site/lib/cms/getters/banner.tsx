import { Input } from '@components/ui'
import { BannerProps } from '@components/ui/Banner'
import { Settable } from '../types'
import { ImageEditor } from './image'

export function BannerEditor({
  setData: setBanner,
  ...banner
}: BannerProps & Settable) {
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
      <ImageEditor
        src={banner.img}
        pathBase="banners/"
        setData={({ img }) => setBanner({ ...banner, img })}
      />
    </>
  )
}
