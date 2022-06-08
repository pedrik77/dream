import Image from 'next/image'
import Button from '../Button'
import s from './Banner.module.css'

const Banner = () => {
  return (
    <div className={s.bgOverlay}>
      <Image
        // className={s.img}
        src="/assets/tesla1_1440x810.jpg"
        alt="alt"
        layout="fill"
        width={1440}
        height={810}
        quality="100"
      />
      <div className={s.bannerContainer}>
        <h2 className={s.h2}>
          WIN A BRAND NEW CAR
          <br></br>
          <span className={s.span}> TESLA BLA</span>
        </h2>
        <p className={s.p}>
          Ice cream chocolate lemon drops sweet soufflé tart fruitcake.
        </p>

        <div className="flex">
          <Button
            aria-label="Join Now"
            type="button"
            className={s.button}
            disabled={false}
          />
        </div>
      </div>
    </div>
  )
}

export default Banner
