import { Button, Hero, Input, Text } from '@components/ui'
import Banner, { BannerProps } from '@components/ui/Banner'
import { PERMISSIONS, useAuthContext } from '@lib/auth'
import {
  BannerComponent,
  ComponentData,
  getBannerStarter,
  getHeroStarter,
  getImageStarter,
  getTextStarter,
  getWysiwygStarter,
  HeroComponent,
  ImageComponent,
  setCmsBlock,
  TextComponent,
  WysiwygComponent,
} from '@lib/components'
import { usePermission } from '@lib/hooks/usePermission'
import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { uploadFile } from '@lib/files'
import { v4 as uuid4 } from 'uuid'
import { HeroProps } from '@components/ui/Hero/Hero'
import Editor from '@components/common/Editor'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { confirm } from '@lib/alerts'

import NextImage from 'next/image'

const selectType = async () =>
  await Swal.fire({
    title: 'Insert new component',
    input: 'select',
    inputOptions: {
      text: 'Text',
      wysiwyg: 'Wysiwyg',
      // image: 'Image',
      banner: 'Banner',
      hero: 'Hero',
    },
    inputPlaceholder: 'Select a component',
    showCancelButton: true,
  })

const getInputs = async (type: string) => {
  await Swal.fire({
    title: 'Insert new component',
    input: 'select',
    inputOptions: {
      text: 'Text',
      wysiwyg: 'Wysiwyg',
      image: 'Image',
      banner: 'Banner',
      hero: 'Hero',
    },
    inputPlaceholder: 'Select a component',
    showCancelButton: true,
  })
}

interface Changeable {
  onChange: (value: any) => void
}

interface Settable {
  setData: (data: any) => void
}

interface ComponentsProps {
  blockId?: string
  children: ComponentData[]
  forceEdit?: boolean
  forbidEdit?: boolean
}

type ChangableComponent = ComponentData &
  Changeable & {
    insertNew: (key?: number) => Promise<void>
    removeSelf: () => void
    forceEdit?: boolean
  }

export function Components({
  blockId,
  children,
  forceEdit = false,
  forbidEdit = false,
}: ComponentsProps) {
  const { adminEditingMode } = useAuthContext()
  const [components, setComponents] = useState<ComponentData[]>([])

  const canEdit =
    usePermission({ permission: PERMISSIONS.CMS }) &&
    (adminEditingMode || forceEdit) &&
    !forbidEdit

  const saveComponents = useCallback(
    (components: ComponentData[]) => {
      setCmsBlock({
        id: blockId,
        components,
      })
    },
    [blockId]
  )

  const insertNew = useCallback(
    async (key?: number) => {
      const componentType = (await selectType()).value

      if (!componentType) return

      let component: ComponentData

      if ('text' === componentType)
        component = { ...getTextStarter().components[0] }

      if ('wysiwyg' === componentType)
        component = { ...getWysiwygStarter().components[0] }

      if ('image' === componentType)
        component = { ...getImageStarter().components[0] }

      if ('banner' === componentType)
        component = { ...getBannerStarter().components[0] }

      if ('hero' === componentType)
        component = { ...getHeroStarter().components[0] }

      // @ts-ignore
      if (!component) return

      if (key === undefined) return setComponents([component, ...components])

      const newComponents = [...components]

      setComponents(
        newComponents
          .slice(0, key)
          .concat([component], newComponents.slice(key))
      )
    },
    [components]
  )

  useEffect(() => {
    setComponents(children.map((c, i) => ({ ...c, order: i })))
  }, [children])

  return (
    <>
      {!components.length && canEdit && (
        <Button type="button" onClick={() => insertNew()}></Button>
      )}
      {components.map((c, i) => (
        <React.Fragment key={blockId + c.type + i}>
          {canEdit && (
            <ComponentEditorItem
              forceEdit={forceEdit}
              insertNew={() => insertNew(i)}
              removeSelf={() => {
                const c = components.filter((_, j) => j !== i)

                confirm('Are you sure?').then((res) => {
                  if (!res) return

                  saveComponents(c)
                  setComponents(c)
                })
              }}
              onChange={(value) => {
                const newComponents = components.map((c, j) =>
                  i === j
                    ? {
                        ...c,
                        value,
                      }
                    : c
                )

                setComponents(newComponents)
                saveComponents(newComponents)
              }}
              {...c}
            />
          )}
          <Component {...c} />
        </React.Fragment>
      ))}
    </>
  )
}

function Component({ type, value }: ComponentData) {
  // @ts-ignore
  if ('image' === type) return <Image alt="" {...value} />

  // @ts-ignore
  if ('banner' === type) return <Banner {...value} />

  // @ts-ignore
  if ('hero' === type) return <Hero {...value} />

  // @ts-ignore
  if ('wysiwyg' === type) return <Text {...value} />

  // @ts-ignore
  if ('text' === type) return <div>{value.text}</div>

  console.log('unknown type', type)

  return <></>
}

function Image({ src = '', alt = 'image' }) {
  if (!src) return null

  return <NextImage src={src} alt={alt} />
}

function ComponentEditorItem({
  type,
  value,
  onChange,
  insertNew,
  forceEdit = false,
  removeSelf,
}: ChangableComponent) {
  const [data, setData] = useState(value)
  const [isEditing, setIsEditing] = useState(false)

  const Editor = useMemo(() => {
    if ('image' === type) return ImageEditor

    if ('banner' === type) return BannerEditor

    if ('hero' === type) return HeroEditor

    if ('wysiwyg' === type) return WysiwygEditor

    if ('text' === type) return TextEditor

    return null
  }, [type])

  useEffect(() => {
    if (forceEdit) setIsEditing(true)
  }, [forceEdit])

  useEffect(() => () => {
    if (forceEdit) onChange(data)
  })

  if (!Editor) return null

  return (
    <div className="flex flex-col">
      <div className="flex">
        {forceEdit ? (
          <></>
        ) : isEditing ? (
          <>
            <Button
              className="mr-4"
              onClick={() => {
                onChange(data)
                setIsEditing(false)
              }}
              type="button"
            >
              Save
            </Button>
            <Button
              className="mr-4"
              onClick={() => setIsEditing(false)}
              type="button"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              className="mr-4"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          </>
        )}
        <Button className="mr-4" type="button">
          Move this component
        </Button>
        <Button className="mr-4" type="button" onClick={() => insertNew()}>
          Insert component before me
        </Button>
        <Button className="mr-4" type="button" onClick={removeSelf}>
          Remove this component
        </Button>
      </div>
      {/* @ts-ignore */}
      {isEditing && <Editor {...data} setData={setData} />}
    </div>
  )
}

function HeroEditor({ setData: setHero, ...hero }: HeroProps & Settable) {
  return (
    <>
      <Input
        value={hero.headline}
        placeholder={'hero.headline'}
        onChange={(headline) => setHero({ ...hero, headline })}
      />
      <Input
        value={hero.description}
        placeholder={'hero.description'}
        onChange={(description) => setHero({ ...hero, description })}
      />
    </>
  )
}

function BannerEditor({
  setData: setBanner,
  ...banner
}: BannerProps & Settable) {
  return (
    <>
      <Input
        value={banner.primaryTitle}
        onChange={(primaryTitle) => setBanner({ ...banner, primaryTitle })}
      />
      <Input
        value={banner.secondaryTitle}
        onChange={(secondaryTitle) => setBanner({ ...banner, secondaryTitle })}
      />
      <Input
        value={banner.button?.text || ''}
        onChange={(text) =>
          setBanner({
            ...banner,
            button: { link: '', ...banner.button, text },
          })
        }
      />
      <Input
        value={banner.button?.link || ''}
        onChange={(link) =>
          setBanner({ ...banner, button: { text: '', ...banner.button, link } })
        }
      />
      <Input value={banner.img} readOnly />
      <ImageEditor
        src={banner.img}
        pathBase="cms/banners/"
        setData={({ img }) => setBanner({ ...banner, img })}
      />
    </>
  )
}

function ImageEditor({
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
    uploadFile(pathBase + uuid4(), file).then((img) => setImage({ img }))
  }

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      <img src={image.src} alt={image.alt} className="max-w-sm" />
    </div>
  )
}

function WysiwygEditor({ html, setData }: { html: string } & Settable) {
  // @ts-ignore
  return <Editor value={html} onChange={(html) => setData({ html })} />
}

function TextEditor({ text, setData }: { text: string } & Settable) {
  return (
    <div>
      <Input value={text} onChange={(text) => setData({ text })} />
    </div>
  )
}
