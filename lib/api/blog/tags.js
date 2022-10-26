import { db } from '@lib/firebase'
import {
  collection,
  query,
  orderBy,
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'

// TODO ts

export async function getTag(tag) {
  const tagData = await getDoc(doc(db, 'tags', tag))

  return { slug: tagData.id, ...tagData.data() }
}

export async function setTag(tag, name, menuPosition = -1) {
  return await setDoc(doc(db, 'tags', tag), { name, menuPosition })
}

export async function deleteTag(tag) {
  return await deleteDoc(doc(db, 'tags', tag))
}

export function useTags() {
  const [tags, setTags] = useState([])

  const menu = useMemo(
    () =>
      tags
        .filter((tag) => tag.menuPosition > 0)
        .sort((a, b) => a.menuPosition - b.menuPosition),
    [tags]
  )

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'tags'), orderBy('name', 'asc')),
        (querySnapshot) => {
          setTags(
            querySnapshot.docs.map((doc) => ({ slug: doc.id, ...doc.data() }))
          )
        }
      ),
    []
  )

  return { tags, menu }
}
