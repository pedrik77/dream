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

export interface Product {}

export async function getProduct(slug: string) {
  const productData = await getDoc(doc(db, 'products', slug))

  return { slug: productData.id, ...productData.data() }
}

export async function setProduct(slug: string) {
  return await setDoc(doc(db, 'products', slug), {})
}

export async function deleteProduct(slug: string | string[]) {
  return await Promise.all(
    (typeof slug === 'string' ? [slug] : slug).map((slug) =>
      deleteDoc(doc(db, 'product', slug))
    )
  )
}

export function useProduct() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(
    () =>
      onSnapshot(collection(db, 'products'), (querySnapshot) => {
        setProducts(
          // @ts-ignore
          querySnapshot.docs.map((doc) => ({
            slug: doc.id,
            ...doc.data(),
          }))
        )
      }),
    []
  )

  return { products }
}
