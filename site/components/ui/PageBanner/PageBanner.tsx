import Image from 'next/image'
import Container from '../Container'
import s from './PageBanner.module.css'

const PageBanner: React.FC<{
  primaryTitle: string
  secondaryTitle: string
  img: string
}> = ({ primaryTitle, secondaryTitle, img }) => {
  return (
    <div className={s.bgOverlay}>
      <div className={s.imgContainer}>
        <Image
          src={img}
          alt="alt"
          width="1440"
          height="810"
          layout="responsive"
          quality="100"
        />
      </div>
      <div className={s.textSection}>
        <div className={s.textContainer}>
          <h2 className={s.h2}>
            {primaryTitle}
            <br />
            <span className={s.span}>{secondaryTitle}</span>
          </h2>
        </div>
      </div>
    </div>
  )
}

export default PageBanner
