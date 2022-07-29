import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import s from './Carousel.module.css'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from '@components/icons'
import Button from '../Button'
import React, { useState } from 'react'
import Text from '../Text'
import ProductSliderControl from '@components/product/ProductSliderControl'

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { origin: 'center', perView: 2.5, spacing: 10 },
    slideChanged: (s) => setCurrentSlide(s.track.details.rel),

    breakpoints: {
      '(max-width: 768px)': {
        slides: { origin: 'center', perView: 1.5 },
      },
      '(max-width: 600px)': {
        slides: { perView: 1 },
      },
    },
  })

  const onPrev = React.useCallback(
    () => instanceRef.current?.prev(),
    [instanceRef]
  )
  const onNext = React.useCallback(
    () => instanceRef.current?.next(),
    [instanceRef]
  )

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

      <ProductSliderControl onPrev={onPrev} onNext={onNext} />
    </section>
  )
}
export default Carousel
