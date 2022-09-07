import { Hero, Input, Text } from '@components/ui'
import Banner from '@components/ui/Banner'
import { PERMISSIONS } from '@lib/auth'
import { ComponentData, useCmsBlock } from '@lib/components'
import { usePermission } from '@lib/hooks/usePermission'
import _ from 'lodash'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

interface ComponentsProps {
  blockId?: string
  children: ComponentData[]
  multiple?: boolean
  isEditing?: boolean
  activeLoading?: boolean
}

interface ComponentProps extends ComponentData {
  onChange?: (value: string) => void
}

const Context = createContext<{
  blockId?: string
  isEditing?: boolean
}>({})

const useCmsContext = () => useContext(Context)

export function Components({
  blockId,
  isEditing = false,
  multiple = false,
  children,
}: ComponentsProps) {
  const canEdit = usePermission({ permission: PERMISSIONS.CMS })

  return (
    <Context.Provider value={{ blockId, isEditing: isEditing && canEdit }}>
      {isEditing && canEdit ? (
        <ComponentEditor>{children}</ComponentEditor>
      ) : (
        children.map((c, i) => <Component key={i} {...c} />)
      )}
    </Context.Provider>
  )
}

function Component({ type, value }: ComponentProps) {
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

function ComponentEditor({ children }: { children: ComponentData[] }) {
  return (
    <>
      {children.map((c, i) => (
        <ComponentEditorItem key={i} {...c} />
      ))}
    </>
  )
}

function ComponentEditorItem({ type, value, onChange }: ComponentProps) {
  // @ts-ignore
  if ('image' === type) return <ImageComponentEditor {...value} />

  // @ts-ignore
  if ('banner' === type) return <BannerEditor {...value} />

  // @ts-ignore
  if ('hero' === type) return <Hero {...value} />

  if ('wysiwyg' === type) return <WysiwygEditor value={value} />

  if ('text' === type) return <TextEditor value={value} />

  console.log('unknown type', type)

  return <></>
}

function BannerEditor() {}

function ImageComponentEditor({
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
