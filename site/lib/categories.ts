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
import { useEffect, useMemo, useState } from 'react'
import { db } from './firebase'

export interface Category {
  slug: string
  title: string
}

export async function getCategory(slug: string): Promise<Category> {
  const categoryData = await getDoc(doc(db, 'categories', slug))

  return { slug: categoryData.id, ...categoryData.data() } as Category
}

export async function setCategory({ slug, title }: Category) {
  return await setDoc(doc(db, 'categories', slug), {
    title,
  })
}

export async function deleteCategory(slug: string | string[]) {
  return await Promise.all(
    (typeof slug === 'string' ? [slug] : slug).map((slug) =>
      deleteDoc(doc(db, 'categories', slug))
    )
  )
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(
    () =>
      onSnapshot(collection(db, 'categories'), (querySnapshot) => {
        setCategories(
          // @ts-ignore
          querySnapshot.docs.map((doc) => ({
            slug: doc.id,
            ...doc.data(),
          }))
        )
      }),
    []
  )

  return categories
}
