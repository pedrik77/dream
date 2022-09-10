import PageBanner, { PageBannerProps } from '@components/ui/PageBanner'
import { ComponentConfig, Settable } from '../types'
import Image from './image'

const type = 'page_banner'

const config: ComponentConfig<PageBannerProps> = {
  type,
  name: 'Page Banner',
  Component: ({ img }) => (
    <PageBanner img={img} width={2000} height={610} alt="banner" />
  ),
  Editor: ({ setData: setPageBanner, ...pageBanner }) => (
    <Image.Editor
      src={pageBanner.img}
      onlySrc
      alt={'banner'}
      pathBase="page_banners/"
      setData={({ src }) => setPageBanner({ ...pageBanner, img: src })}
    />
  ),
  getStarter: async () => ({
    type,
    draft: true,
    value: {
      img: '/assets/winners_banner.jpg',
    },
  }),
}

export default config
