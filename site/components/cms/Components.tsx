import { Button, Hero, Input, Text } from '@components/ui'
import Banner, { BannerProps } from '@components/ui/Banner'
import { PERMISSIONS, useAuthContext } from '@lib/auth'
import { ComponentData, setCmsBlock, useCmsBlock } from '@lib/components'
import { usePermission } from '@lib/hooks/usePermission'
import _ from 'lodash'
import React, { useMemo, useState } from 'react'
import { uploadFile } from '@lib/files'
import { v4 as uuid4 } from 'uuid'
import { HeroProps } from '@components/ui/Hero/Hero'

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
}

type ChangableComponent = ComponentData & Changeable

export function Components({
  blockId,
  children,
  forceEdit = false,
}: ComponentsProps) {
  const { adminEditingMode, adminWasChange } = useAuthContext()
  const canEdit =
    usePermission({ permission: PERMISSIONS.CMS }) &&
    (adminEditingMode || forceEdit)

  return (
    <>
      {children.map((c, i) => (
        <React.Fragment key={i}>
          {canEdit && (
            <ComponentEditorItem
              onChange={(componentValue) => {
                adminWasChange()
                setCmsBlock({
                  id: blockId,
                  components: children.map((c, j) =>
                    i === j ? { ...c, value: componentValue } : c
                  ),
                  order: c.order,
                })
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
  if ('image' === type) return <ImageComponent {...value} />

  // @ts-ignore
  if ('banner' === type) return <Banner {...value} />

  // @ts-ignore
  if ('hero' === type) return <Hero {...value} />

  if ('wysiwyg' === type) return <Text html={value} />

  if ('text' === type) return <>{value}</>

  console.log('unknown type', type)

  return <></>
}

function ImageComponent({ src = '', alt = 'image' }) {
  if (!src) return null

  return <img src={src} alt={alt} />
}

function ComponentEditorItem({ type, value, onChange }: ChangableComponent) {
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

  if (!Editor) return null

  if (!isEditing)
    return <Button onClick={() => setIsEditing(true)}>Edit</Button>

  return (
    <>
      <Button
        onClick={() => {
          onChange(data)
          setIsEditing(false)
        }}
      >
        Save
      </Button>
      {/* @ts-ignore */}
      <Editor {...data} setData={setData} />
    </>
  )
}

function HeroEditor({ setData: setHero, ...hero }: HeroProps & Settable) {
  return (
    <>
      <Input
        value={hero.headline}
        onChange={(headline) => setHero({ ...hero, headline })}
      />
      <Input
        value={hero.description}
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
        onChange={(file) => {
          uploadFile('cms/banners/' + uuid4(), file).then((img) =>
            setBanner({ ...banner, img })
          )
        }}
      />
    </>
  )
}

function ImageEditor({
  src,
  alt = 'image',
  onChange = () => {},
}: {
  src: string
  alt?: string
  onChange?: (file: File) => void
}) {
  const [image, setImage] = useState(src)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      if (!e.target?.result) return
      setImage(e.target.result as string)
    }

    reader.readAsDataURL(file)
    onChange(file)
  }

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      <img src={image} alt={alt} />
    </div>
  )
}

function WysiwygEditor({ value }: { value: string }) {
  const [html, setHtml] = useState(value)

  return (
    <div>
      <Input value={html} onChange={setHtml} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

function TextEditor({ value }: { value: string }) {
  const [text, setText] = useState(value)

  return (
    <div>
      <Input value={text} onChange={setText} />
      <div>{text}</div>
    </div>
  )
}
