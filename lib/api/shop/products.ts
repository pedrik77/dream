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
  cmsBlock?: CmsBlockData | null
  donation_entries: string
  category: string
  winner_order?: string | null
  winnerPage?: CmsBlockData | null
}

interface ProductQuery extends QueryBase<Product> {
  categorySlug?: string
  showClosed?: boolean | null
  winnerAnnounced?: boolean | null
}

const isClosed = (product: Product) => product.closing_date <= new Date()

const getDonorsCount = async (slug: string) => {
  const snapshot = await getDocs(
    query(collection(db, 'orders'), where('products', 'array-contains', slug))
  )

  return snapshot.docs
    .map((doc) => doc.data().customer.email)
    .filter((v, i, a) => a.indexOf(v) === i).length
}

const getProductCmsId = (slug: string) => `product__${slug}`

const getWinnerCmsId = (slug: string) => `winner__${slug}`

export const products = {
  getDonorsCount,
  isClosed,
  getProductCmsId,
  getWinnerCmsId,
  ...create<
    Product,
    Product<DatesTimestamp>,
    ProductQuery,
    { withCmsBlocks?: boolean }
  >('products', {
    getIdKey: () => 'slug',
    defaults: {
      storageName: 'gallery',
      transformerOptions: { withCmsBlocks: true },
    },
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
        queries.push(
          where('closing_date', '<=', Timestamp.fromDate(new Date()))
        )
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
          winner_announce_date: Timestamp.fromDate(
            product.winner_announce_date
          ),
        }
      },
    getTransformerFrom:
      (options = {}) =>
      async (doc) => {
        const docData = doc.data()

        if (!docData) throw new Error()

        const { created_date, closing_date, winner_announce_date, ...data } =
          docData

        const slug = doc.id
        const image = data.gallery && data.gallery[0] ? data.gallery[0] : null

        let cmsBlock = null
        let winnerPage = null

        if (!!options.withCmsBlocks) {
          cmsBlock = await getCmsBlock(getProductCmsId(slug)).catch(
            console.error
          )
          winnerPage = await getCmsBlock(getWinnerCmsId(slug)).catch(
            console.error
          )
        }

        return {
          ...data,
          slug,
          image,
          cmsBlock: cmsBlock || null,
          winnerPage: winnerPage || null,
          created_date: created_date.toDate(),
          closing_date: closing_date?.toDate() || null,
          winner_announce_date: winner_announce_date?.toDate() || null,
        } as Product
      },
  }),
}
