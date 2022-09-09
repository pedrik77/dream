import Editor from '@components/common/Editor'
import { Settable } from '../types'

export function WysiwygEditor({ html, setData }: { html: string } & Settable) {
  // @ts-ignore
  return <Editor value={html} onChange={(html) => setData({ html })} />
}
