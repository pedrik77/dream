import { StarterCommon } from 'cms/types'
import {
  doc,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { noop } from '@lib/api/page/common'
import { db } from '@lib/firebase'
import { AnyClosure } from '@lib/types'

export type ComponentData = StarterCommon

export type CmsBlockData = {
  components: ComponentData[]
}

interface CmsBlockQuery {
  id: string
  onError?: AnyClosure
}

export async function getCmsBlock(id: string) {
  const cmsBlockData = await getDoc(doc(db, 'cms', id))

  return transform(cmsBlockData)
}

export async function getSingleComponent(id: string) {
  const block = await getCmsBlock(id)

  return block.components[0]
}

export async function setCmsBlock({ id, ...block }: any, onError = noop) {
  if (!id) throw new Error('ID is required')
  return await setDoc(doc(db, 'cms', id), {
    ...block,
  }).catch(onError)
}

export function useCmsBlock({ id, onError = noop }: CmsBlockQuery) {
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
  if (!doc.exists()) {
    console.log(doc)
    throw new Error('Document does not exist')
  }

  const { ...data } = doc.data()

  return data as CmsBlockData
}
