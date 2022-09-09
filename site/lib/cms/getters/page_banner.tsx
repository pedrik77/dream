import PageBanner, { PageBannerProps } from '@components/ui/PageBanner'
import { ComponentConfig, Settable } from '../types'
import Image from './image'

const type = 'page_banner'

const config: ComponentConfig<PageBannerProps> = {
  type,
  name: 'Page Banner',
  Component: PageBanner,
  Editor: PageBannerEditor,
  getStarter: () => ({
    type,
    draft: true,
    value: {
      img: '/assets/winners_banner.jpg',
    },
  }),
}

export function PageBannerEditor({
  setData: setPageBanner,
  ...pageBanner
}: Settable<PageBannerProps>) {
  return (
    <>
      <Image.Editor
        src={pageBanner.img}
        pathBase="page_banners/"
        setData={({ src }) => setPageBanner({ ...pageBanner, img: src })}
      />
    </>
  )
}

export default config
