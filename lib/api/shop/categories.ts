import { noop } from '@lib/common'
import { db } from '@lib/firebase'
import { AnyClosure, QueryBase } from '@lib/types'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

export interface Category {
  slug: string
  title: string
  description?: string
}

interface UseCategoriesOptions extends QueryBase<Category> {}
interface UseCategoryOptions {
  slug: string
  onError?: AnyClosure
}

export async function getAllSlugs(): Promise<string[]> {
  const snapshot = await getDocs(collection(db, 'categories'))

  return snapshot.docs.map((doc) => doc.id)
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
            querySnapshot.docs.map(
              (doc) =>
                ({
                  slug: doc.id,
                  ...doc.data(),
                } as Category)
            )
          )
        },
        onError
      ),
    [onError]
  )

  return categories
}

export function getCategoryCmsId(slug: string = '') {
  return `category__${slug}`
}

export const categoryHref = (categorySlug: string) =>
  `/products/category/${categorySlug}`

export const categoryToSelect = (c?: Category) => ({
  value: c?.slug || '',
  label: c?.title || '',
  type: 'category',
})
