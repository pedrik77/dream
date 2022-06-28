import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from './firebase'
import { uploadFile } from './files'
import { v4 as uuid4 } from 'uuid'

export interface ProductImage {
  src: string
  path: string
  filename: string
}

export interface Product {
  slug: string
  title_1: string
  title_2: string
  short_desc: string
  closing_date: number
  winner_announce_date: number
  gallery: ProductImage[]
  long_desc: string
  donation_entries: string
  category: string
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

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(
    () =>
      onSnapshot(collection(db, 'products'), async (querySnapshot) => {
        setProducts(
          await Promise.all(
            // @ts-ignore
            querySnapshot.docs.map(transform)
          )
        )
      }),
    []
  )

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

function transform(doc: any): Product {
  const { closing_date, winner_announce_date, ...data } = doc.data()

  return {
    ...data,
    slug: doc.id,
    closing_date: closing_date.seconds,
    winner_announce_date: winner_announce_date.seconds,
  }
}
