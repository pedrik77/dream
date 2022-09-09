import Image from 'next/image'
import Container from '../Container'
import s from './PageBanner.module.css'

export interface PageBannerProps {
  img: string
}

const PageBanner: React.FC<PageBannerProps> = ({ img }) => {
  return (
    <div className={s.imgContainer}>
      <Image
        src={img}
        alt="alt"
        width="2000"
        height="610"
        layout="responsive"
        quality="100"
      />
    </div>
  )
}

export default PageBanner
