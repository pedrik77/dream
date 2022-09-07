import {
  doc,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { noop } from './common'
import { db } from './firebase'
import { AnyClosure } from './types'

const type = 'text'
const value: { [index: string]: any } | string = ''
const order = -1

export const TextStarter = {
  components: [
    {
      type,
      value,
      order,
    },
  ],
}

export const WysiwygStarter = {
  components: [
    {
      type: 'wysiwyg',
      value: { html: '' },
      order,
    },
  ],
}

export const BannerStarter = {
  components: [
    {
      type: 'banner',
      value: {
        primaryTitle: '',
        secondaryTitle: '',
        subtitle: '',
        img: '',
        button: {
          text: '',
          link: '',
        },
      },
      order,
    },
  ],
}

export type CmsBlockData =
  | typeof TextStarter
  | typeof WysiwygStarter
  | typeof BannerStarter

export type ComponentData =
  | typeof TextStarter.components[0]
  | typeof WysiwygStarter.components[0]
  | typeof BannerStarter.components[0]

interface UseCmsBlockOptions {
  id: string
  onError?: AnyClosure
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
