import Image from 'next/image'
import Container from '../Container'
import s from './PageBanner.module.css'

export interface PageBannerProps {
  img: string
  alt?: string
  width?: number
  height?: number
}

const PageBanner: React.FC<PageBannerProps> = ({ img, alt, width, height }) => {
  return (
    <div className={s.imgContainer}>
      <Image
        src={img}
        alt={alt}
        width={width}
        height={height}
        layout={!!width && !!height ? 'responsive' : 'fill'}
        quality="100"
      />
    </div>
  )
}

export default PageBanner
