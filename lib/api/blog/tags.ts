import { db } from '@lib/firebase'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

export interface Tag {
  slug: string
  name: string
}

export async function getTag(tagSlug: string) {
  const tagData = await getDoc(doc(db, 'tags', tagSlug))

  return { slug: tagData.id, ...tagData.data() }
}

export async function setTag({ slug, ...tag }: any) {
  return await setDoc(doc(db, 'tags', slug), tag)
}

export async function deleteTag(tagSlug: string) {
  return await deleteDoc(doc(db, 'tags', tagSlug))
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'tags'), orderBy('name', 'asc')),
        (querySnapshot) => {
          setTags(
            querySnapshot.docs.map((doc) => ({
              slug: doc.id,
              ...doc.data(),
            })) as Tag[]
          )
        }
      ),
    []
  )

  return tags
}

export const tagToSelect = (t?: Tag) => ({
  value: t?.slug || '',
  label: t?.name || '',
})
