import PageBanner, { PageBannerProps } from '@components/ui/PageBanner'
import { getImageInput } from 'cms/editors/input'
import { ComponentConfig } from '../types'
import { v4 as uuid4 } from 'uuid'

const config: ComponentConfig<PageBannerProps> = {
  type: 'page_banner',
  title: 'Page Banner',
  Component: ({ img }) => (
    <PageBanner img={img} width={2000} height={610} alt="banner" />
  ),
  valuesDefinition: {
    img: [
      'Image',
      '/assets/winners_banner.jpg',
      // @ts-ignore
      getImageInput({ getPath: () => 'cms/page_banner/' + uuid4() }),
    ],
    alt: false,
    width: false,
    height: false,
  },
}

export default config
