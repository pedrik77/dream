import PageBanner, { PageBannerProps } from '@components/ui/PageBanner'
import { getImageInput } from 'cms/editors/input'
import { ComponentConfig } from '../types'

const config: ComponentConfig<PageBannerProps> = {
  type: 'page_banner',
  title: 'Page Banner',
  Component: ({ img }) => (
    <PageBanner img={img} width={2000} height={610} alt="banner" />
  ),
  valuesDefinition: {
    img: [
      ['cms.labels.image', 'cms.labels.pageBanner'],
      '/assets/winners_banner.jpg',
      // @ts-ignore
      getImageInput({ getPath: () => 'cms/page_banner' }),
    ],
    alt: false,
    width: false,
    height: false,
  },
}

export default config
