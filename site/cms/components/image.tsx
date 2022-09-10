import { uploadFile } from '@lib/files'
import { ComponentConfig } from '../types'
import { v4 as uuid4 } from 'uuid'
import NextImage from 'next/image'

export interface ImageProps {
  src: string
  width?: number
  height?: number
  alt?: string
}

const config: ComponentConfig<ImageProps> = {
  type: 'image',
  title: 'Image',
  Component: NextImage,
  valuesDefinition: {
    width: ['Šírka', 2000, 'number'],
    height: ['Výška', 610, 'number'],
    alt: ['Alt text', 'image'],
    src: [
      'Image Source',

      'https://firebasestorage.googleapis.com/v0/b/dream-38748.appspot.com/o/cms%2Fpage_banners%2F09d422b7-a49d-4dd6-9ffc-38a1c3e1b382?alt=media&token=20db2e45-008d-4796-9d97-ccebb22a7f4b',

      ({ value, onChange, component }) => {
        const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e.target.files?.[0]) return

          const file = e.target.files[0]
          const reader = new FileReader()

          reader.onload = (e) => {
            if (!e.target?.result) return
            onChange(e.target.result as string)
          }

          reader.readAsDataURL(file)
          uploadFile('cms/' + uuid4(), file).then((src) => onChange(src))
        }

        return (
          <>
            <input type="file" onChange={handleUpload} />
            <div className="h-full m-8">
              <img
                src={value}
                alt="file"
                className="w-full"
                width={component?.width}
                height={component?.height}
              />
            </div>
          </>
        )
      },
    ],
  },
}

export default config
