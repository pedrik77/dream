import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import s from './Carousel.module.css'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from '@components/icons'
import Button from '../Button'
import { useState } from 'react'
import Text from '../Text'

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
    breakpoints: {
      '(max-width: 768px)': {
        slides: { origin: 'center', perView: 1.5 },
      },
      '(max-width: 600px)': {
        slides: { perView: 1 },
      },
    },
  })

  return (
    <section className={s.root}>
      <Text variant="myHeading" className={s.h2}>
        Check this dessert
      </Text>
      <div className={`keen-slider ${s.keenSlider}`} ref={sliderRef}>
        <div className={`keen-slider__slide ${s.slide}`}>
          <Image layout="fill" src="/assets/tesla3.jpg" alt="placeholder" />
        </div>
        <div className={`keen-slider__slide ${s.slide}`}>
          <Image layout="fill" src="/assets/tesla4.jpg" alt="placeholder" />
        </div>{' '}
        <div className={`keen-slider__slide ${s.slide}`}>
          <Image layout="fill" src="/assets/tesla4.jpg" alt="placeholder" />
        </div>{' '}
        <div className={`keen-slider__slide ${s.slide}`}>
          <Image layout="fill" src="/assets/tesla4.jpg" alt="placeholder" />
        </div>
        <div className={`keen-slider__slide ${s.slide}`}>
          <Image layout="fill" src="/assets/tesla4.jpg" alt="placeholder" />
        </div>
      </div>
      <Button
        className={s.leftArrow}
        onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
        disabled={currentSlide === 0}
      >
        <ArrowLeft />
      </Button>

      <Button
        className={s.rightArrow}
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
