import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Button from '../Button'
import s from './Banner.module.css'

export interface BannerProps {
  primaryTitle: string
  secondaryTitle: string
  subtitle: string
  img: string
  button?: { text: string; link: string }
}

const Banner: React.FC<BannerProps> = ({
  primaryTitle,
  secondaryTitle,
  subtitle,
  img,
  button,
}) => {
  return (
    <div className={s.bgOverlay}>
      <div className={s.imgContainer}>
        <Image
          src={img}
          alt="alt"
          width="2560"
          height="1440"
          layout="fill"
          quality="100"
          objectFit="cover"
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
            <Link href={button.link} passHref>
              <Button
                aria-label={button.text}
                variant="banner"
                type="button"
                className={s.button}
                Component="a"
                // onClick={() => router.push(button.link)}
              >
                {button.text}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Banner
