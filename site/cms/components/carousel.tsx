import { Button } from '@components/ui'
import Carousel from '@components/ui/Carousel'
import { Input } from 'cms/editors/input'
import { ComponentConfig } from '../types'

const typeOptions = ['iframe', 'image', 'product']

type CarouselProps = {
  title: string
  type: typeof typeOptions[number]
  items: string[]
}

const config: ComponentConfig<CarouselProps> = {
  type: 'carousel',
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
      ({ value: items, onChange }) => (
        <fieldset>
          {items.map((url: string, i: number) => (
            <Input
              key={i}
              value={url}
              onChange={(url) => {
                const newItems = [...items]
                newItems[i] = url
                onChange(newItems)
              }}
            />
          ))}
          <Button variant="cms" onClick={() => onChange([...items, ''])}>
            +
          </Button>
        </fieldset>
      ),
    ],
  },
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
