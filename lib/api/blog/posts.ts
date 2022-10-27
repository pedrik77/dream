import { Transformable } from './../creator'
import { QueryBase } from '@lib/types'
import {
  orderBy as queryOrderBy,
  QueryConstraint,
  Timestamp,
  where,
} from 'firebase/firestore'
import { create, FileType } from '../creator'

type WithDate = {
  created_date: Date
  published_date: Date
}

type WithTimestamp = {
  created_date: Timestamp
  published_date: Timestamp
}

export type Post<T = WithDate> = Transformable<
  T,
  {
    slug: string
    title: string
    short_desc: string
    image: FileType | null
    gallery: FileType[]
    long_desc: string
    tags: string[]
  }
>

interface PostQuery extends QueryBase<Post> {
  tag?: string
}

export const posts = create<Post, Post<WithTimestamp>, PostQuery>('posts', {
  getIdKey: () => 'slug',
  getQuery: ({ tag, orderBy = 'published_date', orderDirection = 'desc' }) => {
    const queries: QueryConstraint[] = []

    if (tag) {
      queries.push(where('tags', 'array-contains', tag))
    }

    if (orderBy) {
      queries.push(queryOrderBy(orderBy, orderDirection))
    }

    return queries
  },

  getTransformerFrom: () => async (doc) => {
    const docData = doc.data()

    if (!docData) throw new Error()

    const { created_date, published_date, ...data } = docData

    const slug = doc.id
    const image = data.gallery && data.gallery[0] ? data.gallery[0] : null

    return {
      ...data,
      slug,
      image,
      created_date: created_date.toDate(),
      published_date: published_date.toDate(),
    } as Post
  },

  getTransformerTo: () => async (post: Post) => {
    return {
      ...post,
      created_date: Timestamp.fromDate(new Date(post.created_date)),
      published_date: Timestamp.fromDate(new Date(post.published_date)),
    }
  },
})
