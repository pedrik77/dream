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

export const DEFAULT_BLOCK = {
  components: [
    {
      type,
      value,
      order: -1,
    },
  ],
}

export type CmsBlockData = typeof DEFAULT_BLOCK
export type ComponentData = typeof DEFAULT_BLOCK.components[0]

interface UseCmsBlockOptions {
  id: string
  onError?: AnyClosure
}

export async function getCmsBlock(id: string) {
  const cmsBlockData = await getDoc(doc(db, 'cms', id))

  return transform(cmsBlockData)
}

export async function setCmsBlock({ id, ...block }: any) {
  return await setDoc(doc(db, 'cms', id), {
    ...block,
  })
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

  return block || DEFAULT_BLOCK
}

function transform(doc: DocumentSnapshot): CmsBlockData {
  if (!doc.exists()) throw new Error('Document does not exist')

  const { ...data } = doc.data()

  return data as CmsBlockData
}
