import Image from 'next/image'
import Container from '../Container'
import s from './PageBanner.module.css'

const PageBanner: React.FC<{
  primaryTitle: string
  secondaryTitle: string
  img: string
}> = ({ img }) => {
  return (
    <div className={s.imgContainer}>
      <Image
        src={img}
        alt="alt"
        width="1440"
        height="610"
        layout="responsive"
        quality="100"
      />
    </div>
  )
}

export default PageBanner
