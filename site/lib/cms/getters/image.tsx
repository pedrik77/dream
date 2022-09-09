import { uploadFile } from '@lib/files'
import { ComponentConfig, Settable } from '../types'
import { v4 as uuid4 } from 'uuid'
import NextImage from 'next/image'

const type = 'image'

interface ImageProps {
  src: string
  alt?: string
  pathBase?: string
}

const config: ComponentConfig<ImageProps> = {
  type,
  name: 'Image',
  Component: ({ pathBase, ...img }) => <NextImage {...img} />,
  Editor: ImageEditor,
  getStarter: () => ({
    type,
    draft: true,
    value: {
      src: 'https://firebasestorage.googleapis.com/v0/b/dream-38748.appspot.com/o/avatar%2Ftulic.peter77%40gmail.com?alt=media&token=354df891-7643-4741-b788-dff0ad0d41ae',
      alt: 'pliesen',
    },
  }),
}

function ImageEditor({
  setData: setImage,
  pathBase = '',
  ...image
}: {
  pathBase?: string
} & ImageProps &
  Settable) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      if (!e.target?.result) return
      setImage(e.target.result as string)
    }

    reader.readAsDataURL(file)
    uploadFile('cms/' + pathBase + uuid4(), file).then((src) =>
      setImage({ src })
    )
  }

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      <img src={image.src} alt={image.alt} className="max-w-sm" />
    </div>
  )
}

export default config
