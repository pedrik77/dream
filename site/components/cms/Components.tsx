import { Button, Hero, Input, Text } from '@components/ui'
import Banner, { BannerProps } from '@components/ui/Banner'
import { PERMISSIONS, useAuthContext } from '@lib/auth'
import {
  BannerComponent,
  ComponentData,
  getBannerStarter,
  getCmsBlock,
  getHeroStarter,
  getImageStarter,
  getPageBannerStarter,
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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { uploadFile } from '@lib/files'
import { v4 as uuid4 } from 'uuid'
import { HeroProps } from '@components/ui/Hero/Hero'
import Editor from '@components/common/Editor'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { confirm } from '@lib/alerts'

import NextImage from 'next/image'
import { useScrollDisable } from '@lib/hooks/useScrollDIsable'
import PageBanner, { PageBannerProps } from '@components/ui/PageBanner'

const selectType = async (options?: any) => {
  const optionKeys = Object.keys(options)

  if (optionKeys.length === 1) return { value: optionKeys[0] }

  return await Swal.fire({
    title: 'Insert new component',
    input: 'select',
    inputOptions: options,
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
  children?: ComponentData[]
  forceEdit?: boolean
  forbidEdit?: boolean
  maxNumberOfComponents?: number
  allowedComponents?: string[]
  forbiddenComponents?: string[]
}

type ChangableComponent = ComponentData &
  Changeable & {
    removeSelf: () => void
    toggleMoving: () => void
    isMoving: boolean
    forceEdit?: boolean
    single?: boolean
  }

export function Components({
  blockId,
  children,
  forceEdit = false,
  forbidEdit = false,
  maxNumberOfComponents = -1,
  allowedComponents = [],
  forbiddenComponents = ['text'],
}: ComponentsProps) {
  const loaded = useRef(false)
  const { adminEditingMode } = useAuthContext()
  const [components, setComponents] = useState<ComponentData[]>([])
  const [moving, setMoving] = useState(-1)

  const canEdit =
    usePermission({ permission: PERMISSIONS.CMS }) &&
    (adminEditingMode || forceEdit) &&
    !forbidEdit

  const isMoving = moving > -1

  const atMax = useMemo(
    () =>
      maxNumberOfComponents > 0 && components.length >= maxNumberOfComponents,
    [components, maxNumberOfComponents]
  )

  const componentTypes = useMemo(() => {
    const types: { [i: string]: string } = {
      text: 'Text',
      wysiwyg: 'Wysiwyg',
      image: 'Image',
      hero: 'Hero',
      banner: 'Banner',
      page_banner: 'Page Banner',
    }

    if (allowedComponents.length > 0) {
      Object.keys(types).map((c) => {
        if (forbiddenComponents.includes(c)) delete types[c]
        if (!allowedComponents.includes(c)) delete types[c]
      })
    }

    return types
  }, [allowedComponents, forbiddenComponents])

  const saveComponents = useCallback(
    (components: ComponentData[]) => {
      return setCmsBlock({
        id: blockId,
        components,
      })
    },
    [blockId]
  )

  const move = (clicked: number) => {
    const newComponents = [...components].filter((_, j) => j !== moving)
    const movingComponent = components[moving]

    const slice = clicked > moving ? clicked - 1 : clicked

    setComponents(
      newComponents
        .slice(0, slice)
        .concat([movingComponent], newComponents.slice(slice))
    )

    setMoving(-1)
  }

  const insertNew = useCallback(
    async (key?: number) => {
      const componentType = (await selectType(componentTypes)).value

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

      if ('page_banner' === componentType)
        component = { ...getPageBannerStarter().components[0] }

      if ('hero' === componentType)
        component = { ...getHeroStarter().components[0] }

      // @ts-ignore
      if (!component) return

      if (key === undefined) return setComponents([...components, component])

      const newComponents = [...components]

      setComponents(
        newComponents
          .slice(0, key)
          .concat([component], newComponents.slice(key))
      )
    },
    [components, componentTypes]
  )

  useEffect(() => {
    loaded.current = true
    if (!!children) return setComponents(children)

    if (!blockId) return

    getCmsBlock(blockId)
      .then((block) => {
        setComponents(block.components)
      })
      .catch(console.error)
  }, [blockId, children])

  useEffect(() => {
    if (!loaded.current || !components.length) return

    saveComponents(components)
  }, [components, saveComponents])

  const PlusButton = ({ position = 0 }: { position: number }) =>
    canEdit && !atMax ? (
      <div className="flex justify-center my-2">
        <Button
          className=" rounded-3xl"
          onClick={isMoving ? () => move(position) : () => insertNew(position)}
        >
          {isMoving ? 'Move here' : '+'}
        </Button>
      </div>
    ) : null

  return (
    <>
      <PlusButton position={0} />
      {components.map((c, i) => (
        <>
          <div
            key={blockId + c.type + i}
            className={canEdit ? 'shadow-md' : ''}
          >
            {canEdit && (
              <ComponentEditorItem
                forceEdit={forceEdit}
                single={components.length === 1}
                toggleMoving={() => setMoving(!isMoving ? i : -1)}
                isMoving={isMoving}
                removeSelf={() => {
                  const c = components.filter((_, j) => j !== i)

                  confirm('Are you sure?').then((res) => {
                    if (!res) return

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
                }}
                {...c}
              />
            )}
            {!forceEdit && <Component {...c} />}
          </div>
          {!atMax && <PlusButton position={i + 1} />}
        </>
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

function Image({ src = '', alt = 'image' }) {
  if (!src) return null

  return <NextImage src={src} alt={alt} />
}

function ComponentEditorItem({
  type,
  value,
  onChange,
  toggleMoving,
  isMoving,
  forceEdit = false,
  single = false,
  removeSelf,
}: ChangableComponent) {
  const [data, setData] = useState(value)
  const [isEditing, setIsEditing] = useState(false)

  const Editor = useMemo(() => {
    if ('image' === type) return ImageEditor

    if ('banner' === type) return BannerEditor

    if ('page_banner' === type) return PageBannerEditor

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

  const editorRef = useRef(null)
  useScrollDisable(isEditing && !forceEdit ? editorRef.current : null)

  if (!Editor) return null

  return (
    <div className="flex flex-col">
      <div
        className="flex justify-end gap-2 absolute top-30 right-4 mt-2 shadow-inner z-30"
        ref={editorRef}
      >
        {!forceEdit && !isEditing && (
          <>
            <Button
              variant="cms"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            {!single && (
              <Button variant="cms" type="button" onClick={toggleMoving}>
                {isMoving ? 'Cancel' : 'Move'}
              </Button>
            )}
            {!single && (
              <Button variant="cms" type="button" onClick={removeSelf}>
                Remove
              </Button>
            )}
          </>
        )}
      </div>
      {isEditing && (
        <div
          className={`flex justify-center  z-20 ${
            !forceEdit
              ? 'fixed top-20  py-12 h-5/6 overflow-y-scroll bg-primary w-full'
              : ''
          }`}
        >
          <div className={!forceEdit ? 'max-w-5xl' : ''}>
            {!forceEdit && (
              <>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="cms"
                    onClick={() => {
                      onChange(data)
                      setIsEditing(false)
                    }}
                    type="button"
                  >
                    Save
                  </Button>
                  <Button
                    variant="cms"
                    onClick={() => setIsEditing(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
            {/* @ts-ignore */}
            <Editor {...data} setData={setData} />
          </div>
        </div>
      )}
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

function BannerEditor({
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

function PageBannerEditor({
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
