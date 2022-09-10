import { uploadFile } from '@lib/files'
import { ComponentConfig, Settable } from '../types'
import { v4 as uuid4 } from 'uuid'
import NextImage from 'next/image'
import { Input } from '@components/ui'

const type = 'image'

interface ImageProps {
  src: string
  width?: number
  height?: number
  alt?: string
  pathBase?: string
  onlySrc?: boolean
}

const config: ComponentConfig<ImageProps> = {
  type,
  title: 'Image',
  Component: ({ pathBase, onlySrc, ...img }) => <NextImage {...img} />,
  Editor: ImageEditor,
  valuesDefinition: {
    src: [
      'Image Source',
      'https://firebasestorage.googleapis.com/v0/b/dream-38748.appspot.com/o/cms%2Fpage_banners%2F09d422b7-a49d-4dd6-9ffc-38a1c3e1b382?alt=media&token=20db2e45-008d-4796-9d97-ccebb22a7f4b',
    ],
    width: ['Šírka', 2000],
    height: ['Výška', 610],
    alt: ['Alt text', 'image'],
    pathBase: false,
    onlySrc: false,
  },
}

function ImageEditor({
  setData: setImage,
  pathBase = '',
  onlySrc = false,
  ...image
}: Settable<ImageProps>) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      if (!e.target?.result) return
      setImage({ ...image, src: e.target.result as string })
    }

    reader.readAsDataURL(file)
    uploadFile('cms/' + pathBase + uuid4(), file).then((src) =>
      setImage({ ...image, src })
    )
  }

  return (
    <div>
      {!onlySrc && (
        <>
          <Input
            value={image.width}
            type="number"
            onChange={(width) => setImage({ ...image, width })}
          >
            Width
          </Input>
          <Input
            value={image.height}
            placeholder={'height'}
            onChange={(height) => setImage({ ...image, height })}
          >
            Height
          </Input>
          <Input
            value={image.alt}
            placeholder={'alt'}
            onChange={(alt) => setImage({ ...image, alt })}
          >
            Alt text
          </Input>
        </>
      )}
      <input type="file" onChange={handleUpload} />
      <img src={image.src} alt={image.alt} className="max-w-sm" />
    </div>
  )
}

export default config
