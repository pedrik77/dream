import {
  doc,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { noop } from '../lib/common'
import { db } from '../lib/firebase'
import { AnyClosure } from '../lib/types'
import { CmsBlockData } from './types'

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
