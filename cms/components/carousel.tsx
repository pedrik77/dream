import Carousel from '@components/ui/Carousel'
import { CarouselProps, DefaultSlide, SlidesEditor } from 'cms/editors/carousel'
import { ComponentConfig } from '../types'

const config: ComponentConfig<CarouselProps> = {
  type: 'carousel',
  title: 'Carousel',
  Component: ({ title, items }) => (
    <Carousel title={title} slides={items}>
      {({ slide: { src, type } }) =>
        type === 'iframe' ? (
          <iframe
            width="560"
            height="315"
            src={src}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img src={src} alt="carousel" />
        )
      }
    </Carousel>
  ),
  valuesDefinition: {
    title: ['Title', 'Pozrite kto vyhral'],
    items: ['Items', Array(3).fill(DefaultSlide), SlidesEditor],
  },
}

export default config
