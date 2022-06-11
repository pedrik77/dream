import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import s from './Carousel.module.css'

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
    <section className="keen-slider max-h-screen h-80 my-6 text-2xl" ref={ref}>
      <div className="keen-slider__slide number-slide1 text-accent-0 bg-primary flex justify-center items-center">
        1
      </div>
      <div className="keen-slider__slide number-slide1 text-accent-0 bg-primary flex justify-center items-center">
        2
      </div>
      <div className="keen-slider__slide number-slide1 text-accent-0 bg-primary flex justify-center items-center">
        3
      </div>
      <div className="keen-slider__slide number-slide1 text-accent-0 bg-primary flex justify-center items-center">
        4
      </div>
      <div className="keen-slider__slide number-slide1 text-accent-0 bg-primary flex justify-center items-center">
        5
      </div>
      <div className="keen-slider__slide number-slide1 text-accent-0 bg-primary flex justify-center items-center">
        6
      </div>
    </section>
  )
}
export default Carousel
