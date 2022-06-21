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
  menu_position: number
}

export async function getCategory(category: string) {
  const categoryData = await getDoc(doc(db, 'categories', category))

  return { slug: categoryData.id, ...categoryData.data() }
}

export async function setCategory(
  slug: string,
  title: string,
  menuPosition = -1
) {
  return await setDoc(doc(db, 'categories', slug), {
    title,
    menu_position: menuPosition,
  })
}

export async function deleteCategory(slug: string) {
  return await deleteDoc(doc(db, 'categories', slug))
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])

  const menu = useMemo(
    () =>
      categories
        .filter((category) => category.menu_position > 0)
        .sort((a, b) => a.menu_position - b.menu_position),
    [categories]
  )

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

  return { categories, menu }
}