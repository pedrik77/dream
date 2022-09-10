import PageBanner, { PageBannerProps } from '@components/ui/PageBanner'
import { getEditor } from 'cms/getters'
import { ComponentConfig } from '../types'
import { ImageProps } from './image'

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
      ({ value, onChange }) => {
        const ImageEditor = getEditor<ImageProps>('image', ['src'])

        return (
          // @ts-ignore
          <ImageEditor
            src={value}
            alt={'banner'}
            setData={({ src }) => onChange(src)}
          />
        )
      },
    ],
    alt: false,
    width: false,
    height: false,
  },
}

export default config
