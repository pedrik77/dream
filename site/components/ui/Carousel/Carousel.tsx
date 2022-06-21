import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import s from './Carousel.module.css'
import Image from 'next/image'

const Carousel = () => {
  const [ref] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'free',
    slides: { origin: 'center', perView: 2.5, spacing: 10 },
    range: {
      min: -5,
      max: 5,
    },
  })
  return (
    <section className={s.root}>
      <h2 className={s.h2}>Check this dessert</h2>
      <div className={`keen-slider ${s.keenSlider}`} ref={ref}>
        <div className={`keen-slider__slide ${s.slide}`}>
          <Image
            height="360"
            width="640"
            src="/assets/tesla3.jpg"
            alt="placeholder"
          />
        </div>
        <div className={`keen-slider__slide ${s.slide}`}>
          <Image
            width="640"
            height="360"
            src="/assets/tesla4.jpg"
            alt="placeholder"
          />
        </div>{' '}
        <div className={`keen-slider__slide ${s.slide}`}>
          <Image
            width="640"
            height="360"
            src="/assets/tesla4.jpg"
            alt="placeholder"
          />
        </div>{' '}
        <div className={`keen-slider__slide ${s.slide}`}>
          <Image
            width="640"
            height="360"
            src="/assets/tesla4.jpg"
            alt="placeholder"
          />
        </div>
        <div className={`keen-slider__slide ${s.slide}`}>
          <Image
            width="640"
            height="360"
            src="/assets/tesla4.jpg"
            alt="placeholder"
          />
        </div>
      </div>
    </section>
  )
}
export default Carousel
