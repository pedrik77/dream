import { uploadFile } from '@lib/api/page/files'
import { QueryBase } from '@lib/types'
import {
  orderBy as queryOrderBy,
  QueryConstraint,
  Timestamp,
  where,
} from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { v4 as uuid4 } from 'uuid'
import { create } from '../creator'

export interface PostImage {
  src: string
  path: string
  filename: string
}

type DatesDate = {
  created_date: Date
  published_date: Date
}

type DatesTimestamp = {
  created_date: Timestamp
  published_date: Timestamp
}

export type Post<T extends DatesDate | DatesTimestamp = DatesDate> = T & {
  slug: string
  title: string
  short_desc: string
  image: PostImage | null
  gallery: PostImage[]
  long_desc: string
  tags: string[]
}

interface PostQuery extends QueryBase<Post> {
  tag?: string
}

export const posts = create<Post, Post<DatesTimestamp>, PostQuery>('posts', {
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
