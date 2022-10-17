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
import * as uuid from 'uuid'
import { CustomerDataType } from './auth'
import { Order } from './orders'
import { QueryBase } from './types'
import { CmsBlockData, getCmsBlock } from './cms'

export interface ProductImage {
  src: string
  path: string
  filename: string
}

export interface Product {
  slug: string
  title_1: string
  title_2: string
  price?: number
  show_donors?: boolean
  short_desc: string
  created_date: number
  closing_date: number
  winner_announce_date: number
  image: ProductImage | null
  gallery: ProductImage[]
  long_desc: string
  cmsBlock?: CmsBlockData | null
  donation_entries: string
  category: string
  winner_order?: string
  winnerPage?: CmsBlockData | null
}

interface ProductQuery extends QueryBase<Product> {
  categorySlug?: string
  showClosed?: boolean | null
  winnerAnnounced?: boolean | null
}

export async function getProduct(
  slug: string,
  options = { withCmsBlocks: true }
) {
  const productData = await getDoc(doc(db, 'products', slug))

  return await getTransform(options.withCmsBlocks)(productData)
}

export async function setProduct({ slug, ...product }: any) {
  return await setDoc(doc(db, 'products', slug), transformBack(product))
}

export async function deleteProduct(slug: string | string[]) {
  return await Promise.all(
    (typeof slug === 'string' ? [slug] : slug).map((slug) =>
      deleteDoc(doc(db, 'products', slug))
    )
  )
}

export function useProducts({
  categorySlug = '',
  showClosed = false,
  winnerAnnounced = null,
  orderBy = 'closing_date',
  orderDirection = 'desc',
  onError = console.error,
}: ProductQuery = {}) {
  const [products, setProducts] = useState<Product[]>()

  const queries: QueryConstraint[] = useMemo(() => {
    const queries: QueryConstraint[] = []

    if (categorySlug) {
      queries.push(where('category', '==', categorySlug))
    }

    if (showClosed === false) {
      queries.push(where('closing_date', '>', Timestamp.fromDate(new Date())))
    }

    if (showClosed === true) {
      queries.push(where('closing_date', '<=', Timestamp.fromDate(new Date())))
    }

    if (winnerAnnounced !== null) {
      if (winnerAnnounced) {
        queries.push(where('winner_order', '!=', null))
      }
      if (!winnerAnnounced) {
        queries.push(where('winner_order', '==', null))
      }
    }

    if (orderBy) {
      queries.push(queryOrderBy(orderBy, orderDirection))
    }

    return queries
  }, [categorySlug, showClosed, orderBy, orderDirection, winnerAnnounced])

  useEffect(() => {
    setProducts(undefined)
    return onSnapshot(
      query(collection(db, 'products'), ...queries),
      async (querySnapshot) => {
        const products = await Promise.all(
          querySnapshot.docs.map(getTransform())
        )
        setProducts(products)
      },
      onError
    )
  }, [queries, onError])

  return {
    products: products || [],
    loading: !products,
  }
}

export async function uploadGallery(files: FileList): Promise<ProductImage[]> {
  const uploaded = await Promise.all(
    Array.from(files).map(async (file) => {
      const filename = `${uuid.v4()}_${file.name}`
      const path = `products/${filename}`
      const src = await uploadFile(path, file)

      return { src, path, filename }
    })
  )
  return uploaded
}

export const isClosed = (product: Product) =>
  product.closing_date <= Date.now() / 1000

export async function getDonorsCount(slug: string) {
  const snapshot = await getDocs(
    query(collection(db, 'orders'), where('products', 'array-contains', slug))
  )

  return snapshot.docs
    .map((doc) => doc.data().customer.email)
    .filter((v, i, a) => a.indexOf(v) === i).length
}

export function getProductCmsId(slug: string) {
  return `product__${slug}`
}

export function getWinnerCmsId(slug: string) {
  return `winner__${slug}`
}

const getTransform =
  (withCmsBlocks = false) =>
  async (doc: any) => {
    const { created_date, closing_date, winner_announce_date, ...data } =
      doc.data()

    const slug = doc.id
    const image = data.gallery && data.gallery[0] ? data.gallery[0] : null
    let cmsBlock = null
    let winnerPage = null

    if (withCmsBlocks) {
      cmsBlock = await getCmsBlock(getProductCmsId(slug)).catch(console.error)
      winnerPage = await getCmsBlock(getWinnerCmsId(slug)).catch(console.error)
    }

    return {
      ...data,
      slug,
      image,
      cmsBlock: cmsBlock || null,
      winnerPage: winnerPage || null,
      created_date: created_date ? created_date.seconds : 0,
      closing_date: closing_date.seconds,
      winner_announce_date: winner_announce_date.seconds,
    } as Product
  }

const transformBack = ({ cmsBlock, winnerPage, ...product }: Product) => {
  return {
    ...product,
    created_date: Timestamp.fromDate(new Date(product.created_date * 1000)),
    closing_date: Timestamp.fromDate(new Date(product.closing_date * 1000)),
    winner_announce_date: Timestamp.fromDate(
      new Date(product.winner_announce_date * 1000)
    ),
  }
}
