import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import s from './Carousel.module.css'
import React, { useState } from 'react'
import Text from '../Text'
import ProductSliderControl from '@components/product/ProductSliderControl'
import { useTranslation } from 'react-i18next'

type Slide<T> = ({
  onPrev,
  onNext,
  slide,
}: {
  onPrev: () => void
  onNext: () => void
  slide: T
}) => JSX.Element

export interface CarouselProps<T = any> {
  title: string
  slides: T[]
  children: Slide<T>
}

const Carousel = <T,>({ title, children, slides }: CarouselProps<T>) => {
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
        {title}
      </Text>
      <div className={` ${s.keenSlider} flex justify-center`} ref={sliderRef}>
        {slides.map((slide, i) => {
          return (
            <div key={i} className={`${s.slide} lg:w-1/3`}>
              {children({ onPrev, onNext, slide })}
            </div>
          )
        })}
      </div>
      {/*<div className={`keen-slider ${s.keenSlider}`} ref={sliderRef}>
        {slides.map((slide, i) => {
          return (
            <div key={i} className={`keen-slider__slide ${s.slide}`}>
              {children({ onPrev, onNext, slide })}
            </div>
          )
        })}
         <div className={`keen-slider__slide ${s.slide}`}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/B1vHpIpZBU8"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className={`keen-slider__slide ${s.slide}`}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/4dV-J1RbhEs"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className={`keen-slider__slide ${s.slide}`}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/ZKJrQ0iDwEs"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className={`keen-slider__slide ${s.slide}`}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/B1vHpIpZBU8"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      */}

      <ProductSliderControl onPrev={onPrev} onNext={onNext} />
    </section>
  )
}
export default Carousel
