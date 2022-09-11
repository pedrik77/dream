import { Button } from '@components/ui'
import Carousel from '@components/ui/Carousel'
import { uploadFile } from '@lib/files'
import { Input } from 'cms/editors/input'
import { Select } from 'cms/editors/select'
import { useCallback, useEffect, useState } from 'react'
import { ComponentConfig } from '../types'
import { v4 as uuid4 } from 'uuid'

const typeOptions = ['iframe', 'image']

type Type = typeof typeOptions[number]

type Slide = { src: string; type: Type }

type CarouselProps = {
  title: string
  items: Slide[]
}

const DefaultSlide = {
  src: 'https://www.youtube.com/embed/1Q8fG0TtVAY',
  type: 'iframe',
}

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
    items: [
      'Items',
      Array(5).fill(DefaultSlide),
      ({ value: items, onChange }) => (
        <>
          {items.map((slide: Slide, i: number) => {
            const change = useCallback(
              (slide: any) => {
                const newItems = [...items]
                newItems[i] = slide
                onChange(newItems)
              },
              [i]
            )

            const [uploadImg, setUploadImg] = useState(true)
            const imgTypes = ['upload', 'external']
            const isUploadingImage = uploadImg && slide.type === 'image'
            const inputType = isUploadingImage ? 'file' : 'url'

            return (
              <fieldset key={i} className="border-secondary my-1">
                <Select
                  value={slide.type}
                  onChange={(type) => change({ ...slide, type })}
                  options={typeOptions}
                />
                {slide.type === 'image' && (
                  <Select
                    value={uploadImg ? 'upload' : 'external'}
                    onChange={(type) => setUploadImg(type === 'upload')}
                    options={imgTypes}
                  />
                )}
                <Input
                  key={slide.type}
                  value={slide.src}
                  type={inputType}
                  onChange={(src) => change({ ...slide, src })}
                  onFile={(file) =>
                    uploadFile('cms/carousel/' + uuid4(), file).then((src) =>
                      change({ ...slide, src })
                    )
                  }
                  imagePreview={{ width: 200, height: 200 }}
                />
              </fieldset>
            )
          })}
          <Button variant="cms" onClick={() => onChange([...items, ['']])}>
            +
          </Button>
          <Button
            variant="cms"
            onClick={() => onChange(items.slice(0, items.length - 1))}
          >
            -
          </Button>
        </>
      ),
    ],
  },
}

export default config
