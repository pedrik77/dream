import { QueryBase } from '@lib/types'
import {
  QueryConstraint,
  Timestamp,
  where,
  orderBy as queryOrderBy,
  query,
  collection,
  getDocs,
} from 'firebase/firestore'
import { CmsBlockData, getCmsBlock } from '../cms'
import { create } from '../creator'
import { uploadFile } from '../page/files'
import { v4 as uuid4 } from 'uuid'
import { db } from '@lib/firebase'

export interface ProductImage {
  src: string
  path: string
  filename: string
}

type DatesDate = {
  created_date: Date
  closing_date: Date
  winner_announce_date: Date
}

type DatesTimestamp = {
  created_date: Timestamp
  closing_date: Timestamp
  winner_announce_date: Timestamp
}

export type Product<T extends DatesDate | DatesTimestamp = DatesDate> = T & {
  slug: string
  title_1: string
  title_2: string
  price?: number
  show_donors?: boolean
  short_desc: string
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

export const products = create<
  Product,
  Product<DatesTimestamp>,
  ProductQuery,
  { withCmsBlocks?: boolean }
>('products', {
  getIdKey: () => 'slug',
  getQuery: ({
    categorySlug = '',
    showClosed = false,
    winnerAnnounced = null,
    orderBy = 'closing_date',
    orderDirection = 'desc',
  }) => {
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
  },
  getTransformerTo:
    () =>
    async ({ cmsBlock, winnerPage, ...product }) => {
      return {
        ...product,
        created_date: Timestamp.fromDate(product.created_date),
        closing_date: Timestamp.fromDate(product.closing_date),
        winner_announce_date: Timestamp.fromDate(product.winner_announce_date),
      }
    },
  getTransformerFrom: (options) => async (doc) => {
    const docData = doc.data()

    if (!docData) throw new Error()

    const { created_date, closing_date, winner_announce_date, ...data } =
      docData

    const slug = doc.id
    const image = data.gallery && data.gallery[0] ? data.gallery[0] : null

    let cmsBlock = null
    let winnerPage = null

    if (!!options?.withCmsBlocks) {
      cmsBlock = await getCmsBlock(getProductCmsId(slug)).catch(console.error)
      winnerPage = await getCmsBlock(getWinnerCmsId(slug)).catch(console.error)
    }

    return {
      ...data,
      slug,
      image,
      cmsBlock: cmsBlock || null,
      winnerPage: winnerPage || null,
      created_date: created_date.toDate(),
      closing_date: closing_date.toDate(),
      winner_announce_date: winner_announce_date.toDate(),
    } as Product
  },
})

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

export const isClosed = (product: Product) => product.closing_date <= new Date()

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
