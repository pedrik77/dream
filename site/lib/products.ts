import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy as queryOrderBy,
  query,
  QueryConstraint,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { db } from './firebase'
import { uploadFile } from './files'
import { v4 as uuid4 } from 'uuid'
import { CustomerDataType } from './auth'
import { Order } from './orders'

export interface ProductImage {
  src: string
  path: string
  filename: string
}

export interface Winner {
  customer: CustomerDataType
  order: Order
}

export interface Product {
  slug: string
  title_1: string
  title_2: string
  price?: number
  show_donors?: boolean
  short_desc: string
  closing_date: number
  winner_announce_date: number
  gallery: ProductImage[]
  long_desc: string
  donation_entries: string
  category: string
  winner?: Winner
}

interface UseProductOptions {
  category?: string
  onlyActive?: boolean
  onlyPast?: boolean
  orderBy?: keyof Product
  orderDirection?: 'asc' | 'desc'
  onError?: (e: any) => void
}

export async function getProduct(slug: string) {
  const productData = await getDoc(doc(db, 'products', slug))

  return transform(productData)
}

export async function setProduct({ slug, ...product }: any) {
  return await setDoc(doc(db, 'products', slug), product)
}

export async function deleteProduct(slug: string | string[]) {
  return await Promise.all(
    (typeof slug === 'string' ? [slug] : slug).map((slug) =>
      deleteDoc(doc(db, 'product', slug))
    )
  )
}

export function useProducts({
  category = '',
  onlyActive = false,
  onlyPast = false,
  orderBy,
  orderDirection = 'asc',
  onError = (e) => {},
}: UseProductOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])

  const queries: QueryConstraint[] = useMemo(() => {
    const queries: QueryConstraint[] = []

    if (category) {
      queries.push(where('category', '==', category))
    }

    if (onlyActive) {
      queries.push(where('closing_date', '>', Timestamp.fromDate(new Date())))
    }

    if (onlyPast) {
      queries.push(where('closing_date', '<=', Timestamp.fromDate(new Date())))
    }

    if (orderBy) {
      queries.push(queryOrderBy(orderBy, orderDirection))
    }

    return queries
  }, [category, onlyActive, onlyPast, orderBy, orderDirection])

  try {
    useEffect(
      () =>
        onSnapshot(
          query(collection(db, 'products'), ...queries),
          async (querySnapshot) => {
            setProducts(
              await Promise.all(
                // @ts-ignore
                querySnapshot.docs.map(transform)
              )
            )
          }
        ),
      [queries]
    )
  } catch (e) {
    onError(e)
  }

  return products
}

export async function uploadGallery(files: FileList): Promise<ProductImage[]> {
  const uploaded = await Promise.all(
    Array.from(files).map(async (file) => {
      const filename = `${uuid4()}_${file.name}`
      const path = `products/${filename}`
      const src = await uploadFile(path, file)

      return { src, path, filename }
    })
  )
  return uploaded
}

export async function getDonorsCount(slug: string) {
  const snapshot = await getDocs(
    query(collection(db, 'orders'), where('products', 'array-contains', slug))
  )

  return snapshot.docs
    .map((doc) => doc.data().customer.email)
    .filter((v, i, a) => a.indexOf(v) === i).length
}

function transform(doc: any): Product {
  const { closing_date, winner_announce_date, ...data } = doc.data()

  return {
    ...data,
    slug: doc.id,
    closing_date: closing_date.seconds,
    winner_announce_date: winner_announce_date.seconds,
  }
}
