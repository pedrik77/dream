import Image from 'next/image'
import Button from '../Button'
import s from './Banner.module.css'

const Banner: React.FC<{
  primaryTitle: string
  secondaryTitle: string
  subtitle: string
  img: string
  buttonText: string
}> = ({ primaryTitle, secondaryTitle, subtitle, img, buttonText }) => {
  return (
    <div className={s.bgOverlay}>
      <Image
        // className={s.img}
        src={img}
        alt="alt"
        layout="fill"
        quality="100"
      />
      <div className={s.bannerContainer}>
        <h2 className={s.h2}>
          {primaryTitle}
          <br></br>
          <span className={s.span}>{secondaryTitle}</span>
        </h2>
        <p className={s.p}>{subtitle}</p>
        <div className="flex">
          <Button
            aria-label={buttonText}
            type="button"
            className={s.button}
            disabled={false}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Banner
