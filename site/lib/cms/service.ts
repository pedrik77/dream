import {
  doc,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { noop } from '../common'
import { db } from '../firebase'
import { AnyClosure } from '../types'

const draft = false

export const getTextStarter = () => ({
  components: [
    {
      type: 'text',
      draft,
      value: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
    },
  ],
})

export const getWysiwygStarter = () => ({
  components: [
    {
      type: 'wysiwyg',
      draft,
      value: {
        html: `
        <ul>
          ${['scotty', "doesn't", 'know']
            .map((name) => `<li>${name}</li>`)
            .join('')}
        </ul>
        `,
      },
    },
  ],
})

export const getBannerStarter = () => ({
  components: [
    {
      type: 'banner',
      draft,
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
    },
  ],
})

export const getPageBannerStarter = () => ({
  components: [
    {
      type: 'page_banner',
      draft,
      value: {
        img: '/assets/winners_banner.jpg',
      },
    },
  ],
})

export const getImageStarter = () => ({
  components: [
    {
      type: 'image',
      draft,
      value: {
        img: 'https://firebasestorage.googleapis.com/v0/b/dream-38748.appspot.com/o/avatar%2Ftulic.peter77%40gmail.com?alt=media&token=354df891-7643-4741-b788-dff0ad0d41ae',
        alt: 'pliesen',
      },
    },
  ],
})

export const getHeroStarter = () => ({
  components: [
    {
      type: 'hero',
      draft,
      value: {
        headline: 'Každý je príťaž',
        description:
          'Súťažte o fantastické výhry a podporte tým zmysluplné projekty. Bla bla lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer viverra odio sit amet lorem vestibulum, a condimentum eros hendrerit. Sed sed cursus arcu. Quisque tincidunt justo sed sem consectetur consequat. In non lorem nulla.',
      },
    },
  ],
})

export const TextComponent = getTextStarter().components[0]
export const WysiwygComponent = getWysiwygStarter().components[0]
export const BannerComponent = getBannerStarter().components[0]
export const PageBannerComponent = getPageBannerStarter().components[0]
export const ImageComponent = getImageStarter().components[0]
export const HeroComponent = getHeroStarter().components[0]

const TextStarter = getTextStarter()
const WysiwygStarter = getWysiwygStarter()
const BannerStarter = getBannerStarter()
const PageBannerStarter = getPageBannerStarter()
const ImageStarter = getImageStarter()
const HeroStarter = getHeroStarter()

export type CmsBlockData =
  | typeof TextStarter
  | typeof WysiwygStarter
  | typeof BannerStarter
  | typeof PageBannerStarter
  | typeof ImageStarter
  | typeof HeroStarter

export type ComponentData =
  | typeof TextComponent
  | typeof WysiwygComponent
  | typeof BannerComponent
  | typeof PageBannerComponent
  | typeof ImageComponent
  | typeof HeroComponent

interface UseCmsBlockOptions {
  id: string
  onError?: AnyClosure
}

export function getComponentSelectOptions({
  allowedComponents = [],
  forbiddenComponents = [],
}: { allowedComponents?: string[]; forbiddenComponents?: string[] } = {}) {
  const types: { [i: string]: string } = {
    text: 'Text',
    wysiwyg: 'Wysiwyg',
    image: 'Image',
    hero: 'Hero',
    banner: 'Banner',
    page_banner: 'Page Banner',
  }

  if (allowedComponents.length > 0 || forbiddenComponents.length > 0) {
    Object.keys(types).map((c) => {
      if (!!forbiddenComponents.length && forbiddenComponents.includes(c))
        delete types[c]

      if (!!allowedComponents.length && !allowedComponents.includes(c))
        delete types[c]
    })
  }

  return types
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

export function getComponentStarter(componentType: string) {
  if ('text' === componentType) return { ...getTextStarter().components[0] }

  if ('wysiwyg' === componentType)
    return { ...getWysiwygStarter().components[0] }

  if ('image' === componentType) return { ...getImageStarter().components[0] }

  if ('banner' === componentType) return { ...getBannerStarter().components[0] }

  if ('page_banner' === componentType)
    return { ...getPageBannerStarter().components[0] }

  if ('hero' === componentType) return { ...getHeroStarter().components[0] }

  console.error('Unknown component type', componentType)
}
