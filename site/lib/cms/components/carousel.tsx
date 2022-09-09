import { Input } from '@components/ui'
import Carousel from '@components/ui/Carousel'
import { ComponentConfig, Settable } from '../types'

const type = 'carousel'

const typeOptions = ['iframe', 'image', 'product']

type CarouselProps = {
  title: string
  type: typeof typeOptions[number]
  items: string[]
}

const config: ComponentConfig<CarouselProps> = {
  type,
  name: 'Carousel',
  Component: ({ title, type, items }) => (
    <Carousel title={title} slides={items}>
      {({ slide }) =>
        type === 'iframe' ? (
          <CarouselIframe url={slide} />
        ) : (
          <CarouselImage src={slide} />
        )
      }
    </Carousel>
  ),
  Editor: CarouselEditor,
  getStarter: () => ({
    type,
    draft: true,
    value: {
      title: 'Pozrite kto vyhral',
      type: 'iframe',
      items: [
        'https://www.youtube.com/embed/1Q8fG0TtVAY',
        'https://www.youtube.com/embed/1Q8fG0TtVAY',
        'https://www.youtube.com/embed/1Q8fG0TtVAY',
        'https://www.youtube.com/embed/1Q8fG0TtVAY',
        'https://www.youtube.com/embed/1Q8fG0TtVAY',
      ],
    },
  }),
}

function CarouselEditor({
  setData: setCarousel,
  ...carousel
}: Settable<CarouselProps>) {
  return (
    <>
      <Input
        value={carousel.title}
        onChange={(title) => setCarousel({ ...carousel, title })}
      >
        <span className="text-white">Title</span>
      </Input>
    </>
  )
}

function CarouselImage({ src }: { src: string }) {
  return <img src={src} alt="carousel" />
}

function CarouselIframe({ url }: { url: string }) {
  return (
    <iframe
      width="560"
      height="315"
      src={url}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}

export default config
