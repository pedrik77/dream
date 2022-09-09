import { PageBannerProps } from '@components/ui/PageBanner'
import { Settable } from '../types'
import { ImageEditor } from './image'

export function PageBannerEditor({
  setData: setPageBanner,
  ...pageBanner
}: PageBannerProps & Settable) {
  return (
    <>
      <ImageEditor
        src={pageBanner.img}
        pathBase="page_banners/"
        setData={({ img }) => setPageBanner({ ...pageBanner, img })}
      />
    </>
  )
}
