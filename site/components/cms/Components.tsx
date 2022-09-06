import { Input } from '@components/ui'
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

type Trigger = () => void
type Triggers = { save: Trigger }
type RemoveTriggers = () => void
type AddTriggers = (triggers: Triggers, key?: string) => RemoveTriggers

interface ComponentsProps {
  blockId?: string
  children: ComponentData[]
  multiple?: boolean
  isEditing?: boolean
  activeLoading?: boolean
  addTriggers?: AddTriggers
}

interface ComponentProps extends ComponentData {
  onChange?: (value: string) => void
}

const Context = createContext<{
  blockId?: string
  addTriggers?: AddTriggers
}>({})

const useCmsContext = () => useContext(Context)

export const useSaveTrigger = () => {
  const [triggers, setTriggers] = useState<{ [index: string]: Trigger }>({})

  const addTriggers = ({ save }: Triggers, key = '') => {
    setTriggers((triggers) => ({ ...triggers, [key]: save }))

    return () => setTriggers((triggers) => _.omit(triggers, key))
  }

  const triggerSave = () =>
    Object.values(triggers).forEach((trigger) => trigger())

  return { triggerSave, addTriggers }
}

export const useSaveAction = (key: string, save: () => void) => {
  const { addTriggers } = useCmsContext()
  const triggerAdded = useRef(false)

  useEffect(() => {
    if (triggerAdded.current || !addTriggers) return
    triggerAdded.current = true
    return addTriggers({ save }, key)
  }, [addTriggers, save, key])
}

export function Components({
  blockId,
  isEditing = false,
  multiple = false,
  children,
  addTriggers,
}: ComponentsProps) {
  const canEdit = usePermission({ permission: PERMISSIONS.CMS })

  useSaveAction('key', () => console.log('save'))

  const displayEditor = useMemo(
    () => isEditing && canEdit && !!blockId,
    [isEditing, canEdit, blockId]
  )

  return (
    <Context.Provider value={{ blockId, addTriggers }}>
      {displayEditor ? (
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
  if ('banner' === type) return <BannerComponent {...value} />

  if ('wysiwyg' === type)
    return <div dangerouslySetInnerHTML={{ __html: value }} />

  if ('text' === type) return <>{value}</>

  console.log('unknown type', type)

  return <></>
}

function BannerComponent({
  image,
  title,
  subtitle,
}: {
  image: string
  title: string
  subtitle: string
}) {
  return (
    <div className="relative">
      <img src={image} alt={title} className="w-full" />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl font-bold">{title}</h1>
        <h2 className="text-2xl">{subtitle}</h2>
      </div>
    </div>
  )
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

function ComponentEditorItem({ type, value }: ComponentProps) {
  // @ts-ignore
  if ('image' === type) return <ImageComponentEditor {...value} />

  if ('wysiwyg' === type) return <WysiwygEditor value={value} />

  if ('text' === type) return <TextEditor value={value} />

  console.log('unknown type', type)

  return <></>
}

function ImageComponentEditor({ src = '', alt = 'image' }) {
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
