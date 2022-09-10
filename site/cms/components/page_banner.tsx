import PageBanner, { PageBannerProps } from '@components/ui/PageBanner'
import { getEditor } from 'cms/getters'
import { ComponentConfig } from '../types'

const type = 'page_banner'

const ImageEditor = getEditor('image')

const config: ComponentConfig<PageBannerProps> = {
  type,
  title: 'Page Banner',
  Component: ({ img }) => (
    <PageBanner img={img} width={2000} height={610} alt="banner" />
  ),
  Editor: ({ setData: setPageBanner, ...pageBanner }) => (
    <ImageEditor
      src={pageBanner.img}
      onlySrc
      alt={'banner'}
      pathBase="page_banners/"
      setData={({ src }) => setPageBanner({ ...pageBanner, img: src })}
    />
  ),
  valuesDefinition: {
    img: ['Image', '/assets/winners_banner.jpg'],
    alt: false,
    width: false,
    height: false,
  },
}

export default config
