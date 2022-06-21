import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { db } from './firebase'

export interface Product {
  slug: string
  title_1: string
  title_2: string
  short_desc: string
  closing_date: Date
  winner_announce_date: Date
  gallery_id: string
  long_desc: string
  donation_entries: string
}

export async function getProduct(slug: string) {
  const productData = await getDoc(doc(db, 'products', slug))

  return transform(productData)
}

export async function setProduct({ slug, ...product }: Product) {
  return await setDoc(doc(db, 'products', slug), product)
}

export async function deleteProduct(slug: string | string[]) {
  return await Promise.all(
    (typeof slug === 'string' ? [slug] : slug).map((slug) =>
      deleteDoc(doc(db, 'product', slug))
    )
  )
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(
    () =>
      onSnapshot(collection(db, 'products'), (querySnapshot) => {
        setProducts(
          // @ts-ignore
          querySnapshot.docs.map(transform)
        )
      }),
    []
  )

  return products
}

function transform(doc: QueryDocumentSnapshot<DocumentData>) {
  const { closing_date, winner_announce_date, ...data } = doc.data()

  return {
    ...data,
    slug: doc.id,
    closing_date: new Date(closing_date.seconds * 1000),
    winner_announce_date: new Date(winner_announce_date.seconds * 1000),
  }
}
