import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import s from './Carousel.module.css'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from '@components/icons'
import Button from '../Button'
import { useState } from 'react'

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'free',
    slides: { origin: 'center', perView: 2.5, spacing: 10 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    range: {
      min: -5,
      max: 5,
    },
  })

  return (
    <section className={s.root}>
      <h2 className={s.h2}>Check this dessert</h2>
      <div className={`keen-slider ${s.keenSlider}`} ref={sliderRef}>
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
      <Button
        onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
        disabled={currentSlide === 0}
      >
        <ArrowLeft />
      </Button>

      <Button
        onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()}
        disabled={
          currentSlide ===
          (instanceRef?.current?.track.details.slides.length || 0) - 1
        }
      >
        <ArrowRight />
      </Button>
    </section>
  )
}
export default Carousel
