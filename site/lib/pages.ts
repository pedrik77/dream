import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { noop } from './common'
import { db } from './firebase'
import { AnyClosure, QueryBase } from './types'

export interface Page {
  title: string
  slug: string
  meta_title?: string
  meta_description?: string
  meta_robots?: string
  og_title?: string
  og_type?: string
  og_locale?: string
  og_description?: string
  og_site_name?: string
  og_url?: string
  og_image_url?: string
  og_image_width?: string
  og_image_height?: string
  og_image_alt?: string
}

interface UsePagesOptions extends QueryBase<Page> {}
interface UsePageOptions {
  slug: string
  onError?: AnyClosure
}

export async function getAllSlugs(): Promise<string[]> {
  const snapshot = await getDocs(collection(db, 'pages'))

  return snapshot.docs.map((doc) => doc.id)
}

export async function getPage(slug: string): Promise<Page> {
  const pageData = await getDoc(doc(db, 'pages', slug))

  return { slug: pageData.id, ...pageData.data() } as Page
}

export async function setPage({ slug, title }: Page) {
  return await setDoc(doc(db, 'pages', slug), {
    title,
  })
}

export async function deletePage(slug: string | string[]) {
  return await Promise.all(
    (typeof slug === 'string' ? [slug] : slug).map((slug) =>
      deleteDoc(doc(db, 'pages', slug))
    )
  )
}

export function usePage({ slug, onError = noop }: UsePageOptions) {
  const [page, setPage] = useState<Page>()

  useEffect(() => {
    getPage(slug)
      .then(setPage)
      .catch((e) => {
        setPage(undefined)
        onError(e)
      })
  }, [slug, onError])

  return page
}

export function usePages({ onError = console.error }: UsePagesOptions = {}) {
  const [pages, setPages] = useState<Page[]>([])

  useEffect(
    () =>
      onSnapshot(
        collection(db, 'pages'),
        (querySnapshot) => {
          setPages(
            querySnapshot.docs.map(
              (doc) =>
                ({
                  slug: doc.id,
                  ...doc.data(),
                } as Page)
            )
          )
        },
        onError
      ),
    [onError]
  )

  return pages
}

export function getPageCmsId(slug: string = '') {
  return `page__${slug}`
}

export const pageHref = (pageSlug: string) => `/${pageSlug}`

export const pageToSelect = (p?: Page) => ({
  value: p?.slug || '',
  label: p?.title || '',
  type: 'page',
})
