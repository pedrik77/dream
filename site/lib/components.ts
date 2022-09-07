import {
  doc,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { noop } from './common'
import { db } from './firebase'
import { AnyClosure } from './types'

const order = -1

export const getTextStarter = () => ({
  components: [
    {
      type: 'text',
      value: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue. Nullam quis risus eget urna mollis ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut id elit. Nullam quis risus eget urna mollis ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut id elit. ',
      },
      order,
    },
  ],
})

// html code snippet with list

export const getWysiwygStarter = () => ({
  components: [
    {
      type: 'wysiwyg',
      value: {
        html: `
        <ul>
          ${['scotty', "doesn't", 'know']
            .map((name) => `<li>${name}</li>`)
            .join('')}
        </ul>
        `,
      },
      order,
    },
  ],
})

export const getBannerStarter = () => ({
  components: [
    {
      type: 'banner',
      value: {
        primaryTitle: 'vysnivaj.si',
        secondaryTitle: 'Traktar 4000',
        subtitle: 'Vyhrajte jedinečný Traktar 4000',
        img: '/assets/car_2560x1440.jpg',
        button: {
          text: 'CHCEM VYHRAŤ',
          link: '/products/traktar-4000',
        },
      },
      order,
    },
  ],
})

export const getImageStarter = () => ({
  components: [
    {
      type: 'image',
      value: {
        img: 'https://firebasestorage.googleapis.com/v0/b/dream-38748.appspot.com/o/avatar%2Ftulic.peter77%40gmail.com?alt=media&token=354df891-7643-4741-b788-dff0ad0d41ae',
        alt: 'pliesen',
      },
      order,
    },
  ],
})

export const getHeroStarter = () => ({
  components: [
    {
      type: 'hero',
      value: {
        headline: 'Každý je príťaž',
        description:
          'Súťažte o fantastické výhry a podporte tým zmysluplné projekty. Bla bla lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer viverra odio sit amet lorem vestibulum, a condimentum eros hendrerit. Sed sed cursus arcu. Quisque tincidunt justo sed sem consectetur consequat. In non lorem nulla.',
      },
      order,
    },
  ],
})

export const TextComponent = getTextStarter().components[0]
export const WysiwygComponent = getWysiwygStarter().components[0]
export const BannerComponent = getBannerStarter().components[0]
export const ImageComponent = getImageStarter().components[0]
export const HeroComponent = getHeroStarter().components[0]

const TextStarter = getTextStarter()
const WysiwygStarter = getWysiwygStarter()
const BannerStarter = getBannerStarter()
const ImageStarter = getImageStarter()
const HeroStarter = getHeroStarter()

export type CmsBlockData =
  | typeof TextStarter
  | typeof WysiwygStarter
  | typeof BannerStarter
  | typeof ImageStarter
  | typeof HeroStarter

export type ComponentData =
  | typeof TextComponent
  | typeof WysiwygComponent
  | typeof BannerComponent
  | typeof ImageComponent
  | typeof HeroComponent

interface UseCmsBlockOptions {
  id: string
  onError?: AnyClosure
}

export async function getCmsBlock(id: string) {
  const cmsBlockData = await getDoc(doc(db, 'cms', id))

  return transform(cmsBlockData)
}

export async function setCmsBlock({ id, ...block }: any, onError = noop) {
  if (!id) throw new Error('ID is required')
  return await setDoc(doc(db, 'cms', id), {
    ...block,
  }).catch(onError)
}

export function useCmsBlock({ id, onError = noop }: UseCmsBlockOptions) {
  const [block, setBlock] = useState<CmsBlockData>()

  useEffect(
    () =>
      onSnapshot(
        doc(db, 'cms', id),
        (doc) => setBlock(transform(doc)),
        onError
      ),
    [id, onError]
  )

  return block || { components: [] }
}

function transform(doc: DocumentSnapshot): CmsBlockData {
  if (!doc.exists()) throw new Error('Document does not exist')

  const { ...data } = doc.data()

  return data as CmsBlockData
}
