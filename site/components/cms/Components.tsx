import { PERMISSIONS } from '@lib/auth'
import { ComponentData, useCmsBlock } from '@lib/components'
import { usePermission } from '@lib/hooks/usePermission'
import React, { useEffect, useState } from 'react'

interface ComponentsProps {
  children: ComponentData[]
  multiple?: boolean
  isEditing?: boolean
}

interface ComponentProps extends ComponentData {
  onChange?: (value: string) => void
}

export function Components({
  isEditing = false,
  multiple = false,
  children,
}: ComponentsProps) {
  const canEdit = usePermission({ permission: PERMISSIONS.CMS })

  return (
    <>
      {isEditing && canEdit ? (
        <ComponentEditor>{children}</ComponentEditor>
      ) : (
        children.map((c, i) => <Component key={i} {...c} />)
      )}
    </>
  )
}

function Component({ type, value }: ComponentProps) {
  // @ts-ignore
  if ('image' === type) return <ImageComponent {...value} />

  if ('wysiwyg' === type)
    return <div dangerouslySetInnerHTML={{ __html: value }} />

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
      <textarea value={html} onChange={(e) => setHtml(e.target.value)} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

function TextEditor({ value }: { value: string }) {
  const [text, setText] = useState(value)

  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <div>{text}</div>
    </div>
  )
}
