import { Changeable, InputEditor } from 'cms/types'
import { uploadFile } from '@lib/api/page/files'
import { getImageInput, Input } from 'cms/editors/input'
import { Select } from 'cms/editors/select'
import { useState } from 'react'
import { v4 as uuid4 } from 'uuid'
import { Button } from '@components/ui'

const typeOptions = ['iframe', 'image']

type Type = typeof typeOptions[number]

type Slide = { src: string; type: Type }

export type CarouselProps = {
  title: string
  items: Slide[]
}

export const DefaultSlide = {
  src: '',
  type: 'iframe',
}

export const SlideEditor = ({ onChange, ...slide }: Changeable & Slide) => {
  const [uploadImg, setUploadImg] = useState(true)
  const imgTypes = ['upload', 'external']
  const isUploadingImage = uploadImg && slide.type === 'image'
  const inputType = isUploadingImage ? 'file' : 'url'

  return (
    <fieldset className="border-secondary my-1">
      <Select
        value={slide.type}
        onChange={(type) => onChange({ ...slide, type })}
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
        onChange={(src) => onChange({ ...slide, src })}
        onFile={(file) =>
          uploadFile('cms/carousel/' + uuid4(), file).then((src) =>
            onChange({ ...slide, src })
          )
        }
        imagePreview={{ width: 200, height: 200 }}
      />
    </fieldset>
  )
}

export const SlidesEditor: InputEditor<Slide[], CarouselProps> = ({
  value: slides,
  onChange,
}) => {
  return (
    <>
      <Button variant="cms" onClick={() => onChange([DefaultSlide, ...slides])}>
        +
      </Button>
      <Button variant="cms" onClick={() => onChange(slides.slice(1))}>
        -
      </Button>
      {slides.map((slide, i) => {
        return (
          <SlideEditor
            key={i}
            onChange={(slide: any) => {
              const newSlides = [...slides]
              newSlides[i] = slide
              onChange(newSlides)
            }}
            {...slide}
          />
        )
      })}
    </>
  )
}
