import { Button, Input } from '@components/ui'
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
  title: 'Carousel',
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
  valuesDefinition: {
    title: ['Title', 'Pozrite kto vyhral'],
    type: ['Type', 'iframe'],
    items: [
      'Items',
      [
        'https://www.youtube.com/embed/1Q8fG0TtVAY',
        'https://www.youtube.com/embed/1Q8fG0TtVAY',
        'https://www.youtube.com/embed/1Q8fG0TtVAY',
        'https://www.youtube.com/embed/1Q8fG0TtVAY',
        'https://www.youtube.com/embed/1Q8fG0TtVAY',
      ],
    ],
  },
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

      <fieldset>
        {carousel.items.map((url, i) => (
          <Input
            key={i}
            value={url}
            onChange={(url) => {
              const items = [...carousel.items]
              items[i] = url
              setCarousel({ ...carousel, items })
            }}
          >
            <span className="text-white">Item {i + 1}</span>
          </Input>
        ))}
        <Button
          variant="cms"
          onClick={() =>
            setCarousel({ ...carousel, items: [...carousel.items, ''] })
          }
        >
          +
        </Button>
      </fieldset>
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
