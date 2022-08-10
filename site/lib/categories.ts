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
import { noop } from './common'
import { db } from './firebase'
import { AnyClosure, QueryBase } from './types'

export interface Category {
  slug: string
  title: string
  banner: string | null
}

interface UseCategoriesOptions extends QueryBase<Category> {}
interface UseCategoryOptions {
  slug: string
  onError?: AnyClosure
}

export async function getCategory(slug: string): Promise<Category> {
  const categoryData = await getDoc(doc(db, 'categories', slug))

  return { slug: categoryData.id, ...categoryData.data() } as Category
}

export async function setCategory({ slug, title, banner = null }: Category) {
  return await setDoc(doc(db, 'categories', slug), {
    title,
    banner,
  })
}

export async function deleteCategory(slug: string | string[]) {
  return await Promise.all(
    (typeof slug === 'string' ? [slug] : slug).map((slug) =>
      deleteDoc(doc(db, 'categories', slug))
    )
  )
}

export function useCategory({ slug, onError = noop }: UseCategoryOptions) {
  const [category, setCategory] = useState<Category>()

  useEffect(() => {
    getCategory(slug)
      .then(setCategory)
      .catch((e) => {
        setCategory(undefined)
        onError(e)
      })
  }, [slug, onError])

  return category
}

export function useCategories({
  onError = console.error,
}: UseCategoriesOptions = {}) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(
    () =>
      onSnapshot(
        collection(db, 'categories'),
        (querySnapshot) => {
          setCategories(
            // @ts-ignore
            querySnapshot.docs.map((doc) => ({
              slug: doc.id,
              ...doc.data(),
            }))
          )
        },
        onError
      ),
    [onError]
  )

  return categories
}

export const categoryHref = (categorySlug: string) =>
  `/products?category=${categorySlug}`

export const categoryToSelect = (c?: Category) => ({
  value: c?.slug || '',
  label: c?.title || '',
  type: 'category',
})
