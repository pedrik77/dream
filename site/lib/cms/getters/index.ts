import { BannerEditor } from './Banner'
import { HeroEditor } from './hero'
import { ImageEditor } from './image'
import { PageBannerEditor } from './page_banner'
import { TextEditor } from './text'
import { WysiwygEditor } from './wysiwyg'

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

export function getComponentStarter(componentType: string) {
  if ('wysiwyg' === componentType)
    return { ...getWysiwygStarter().components[0] }

  if ('image' === componentType) return { ...getImageStarter().components[0] }

  if ('banner' === componentType) return { ...getBannerStarter().components[0] }

  if ('page_banner' === componentType)
    return { ...getPageBannerStarter().components[0] }

  if ('hero' === componentType) return { ...getHeroStarter().components[0] }

  return { ...getTextStarter().components[0] }
}

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

export function getEditor(type: string) {
  if ('image' === type) return ImageEditor

  if ('banner' === type) return BannerEditor

  if ('page_banner' === type) return PageBannerEditor

  if ('hero' === type) return HeroEditor

  if ('wysiwyg' === type) return WysiwygEditor

  if ('text' === type) return TextEditor

  return null
}
