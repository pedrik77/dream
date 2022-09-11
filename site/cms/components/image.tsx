import { uploadFile } from '@lib/files'
import { ComponentConfig } from '../types'
import { v4 as uuid4 } from 'uuid'
import NextImage from 'next/image'
import { Input } from 'cms/editors/input'

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
        const { width, height } = component ?? {}
        const imagePreview = width && height ? { width, height } : undefined

        return (
          <Input
            type="file"
            value={value}
            onFile={(file) =>
              uploadFile('cms/' + uuid4(), file).then((src) => onChange(src))
            }
            onChange={console.log}
            imagePreview={imagePreview}
          />
        )
      },
    ],
  },
}

export default config
