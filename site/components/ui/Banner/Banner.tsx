import Image from 'next/image'
import { useRouter } from 'next/router'
import Button from '../Button'
import s from './Banner.module.css'

const Banner: React.FC<{
  primaryTitle: string
  secondaryTitle: string
  subtitle: string
  img: string
  button?: { text: string; link: string }
}> = ({ primaryTitle, secondaryTitle, subtitle, img, button }) => {
  const router = useRouter()

  return (
    <div className={s.bgOverlay}>
      <div className={s.imgContainer}>
        <Image
          src={img}
          alt="alt"
          width="1440"
          height="910"
          layout="responsive"
          quality="100"
        />
      </div>
      <div className={s.bannerContainer}>
        <h2 className={s.h2}>
          {primaryTitle}
          <br></br>
          <span className={s.span}>{secondaryTitle}</span>
        </h2>
        <p className={s.p}>{subtitle}</p>
        {!!button && (
          <div className="flex">
            <Button
              aria-label={button.text}
              variant="banner"
              type="button"
              className={s.button}
              onClick={() => router.push(button.link)}
            >
              {button.text}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Banner
