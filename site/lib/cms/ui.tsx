import { HeroProps } from '@components/ui/Hero/Hero'
import { ComponentData, Settable } from './types'
import Editor from '@components/common/Editor'
import { uploadFile } from '@lib/files'
import { v4 as uuid4 } from 'uuid'
import { Button, Hero, Input, Text } from '@components/ui'
import Banner, { BannerProps } from '@components/ui/Banner'
import PageBanner, { PageBannerProps } from '@components/ui/PageBanner'
import NextImage from 'next/image'

export function Component({ type, value }: ComponentData) {
  // @ts-ignore
  if ('image' === type) return <NextImage alt="image" {...value} />

  // @ts-ignore
  if ('banner' === type) return <Banner {...value} />

  // @ts-ignore
  if ('page_banner' === type) return <PageBanner {...value} />

  // @ts-ignore
  if ('hero' === type) return <Hero {...value} />

  // @ts-ignore
  if ('wysiwyg' === type) return <Text {...value} />

  // @ts-ignore
  if ('text' === type) return <div>{value.text}</div>

  console.log('unknown type', type)

  return <></>
}

export function HeroEditor({
  setData: setHero,
  ...hero
}: HeroProps & Settable) {
  return (
    <>
      <Input
        value={hero.headline}
        placeholder={'hero.headline'}
        onChange={(headline) => setHero({ ...hero, headline })}
      >
        <span className="text-white">Headline</span>
      </Input>
      <Input
        value={hero.description}
        placeholder={'hero.description'}
        onChange={(description) => setHero({ ...hero, description })}
      >
        <span className="text-white">Description</span>
      </Input>
    </>
  )
}

export function BannerEditor({
  setData: setBanner,
  ...banner
}: BannerProps & Settable) {
  return (
    <>
      <Input
        variant="cms"
        value={banner.primaryTitle}
        onChange={(primaryTitle) => setBanner({ ...banner, primaryTitle })}
      />
      <Input
        variant="cms"
        value={banner.secondaryTitle}
        onChange={(secondaryTitle) => setBanner({ ...banner, secondaryTitle })}
      />
      <Input
        variant="cms"
        value={banner.button?.text || ''}
        onChange={(text) =>
          setBanner({
            ...banner,
            button: { link: '', ...banner.button, text },
          })
        }
      />
      <Input
        variant="cms"
        value={banner.button?.link || ''}
        onChange={(link) =>
          setBanner({ ...banner, button: { text: '', ...banner.button, link } })
        }
      />
      <Input variant="cms" value={banner.img} readOnly />
      <ImageEditor
        src={banner.img}
        pathBase="banners/"
        setData={({ img }) => setBanner({ ...banner, img })}
      />
    </>
  )
}

export function PageBannerEditor({
  setData: setPageBanner,
  ...pageBanner
}: PageBannerProps & Settable) {
  return (
    <>
      <ImageEditor
        src={pageBanner.img}
        pathBase="page_banners/"
        setData={({ img }) => setPageBanner({ ...pageBanner, img })}
      />
    </>
  )
}

export function ImageEditor({
  setData: setImage,
  pathBase = '',
  ...image
}: {
  src: string
  alt?: string
  pathBase?: string
} & Settable) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      if (!e.target?.result) return
      setImage(e.target.result as string)
    }

    reader.readAsDataURL(file)
    uploadFile('cms/' + pathBase + uuid4(), file).then((img) =>
      setImage({ img })
    )
  }

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      <img src={image.src} alt={image.alt} className="max-w-sm" />
    </div>
  )
}
