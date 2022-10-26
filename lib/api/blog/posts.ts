import { uploadFile } from '@lib/api/page/files'
import { db } from '@lib/firebase'
import { QueryBase } from '@lib/types'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  orderBy as queryOrderBy,
  query,
  QueryConstraint,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import * as uuid from 'uuid'

export interface PostImage {
  src: string
  path: string
  filename: string
}

export interface Post {
  slug: string
  title: string
  short_desc: string
  image: PostImage | null
  gallery: PostImage[]
  long_desc: string
  tags: string[]
  created_date: number
  published_date: number

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

interface PostQuery extends QueryBase<Post> {
  tag?: string
}

export async function getPost(slug: string, options = { withCmsBlocks: true }) {
  const postData = await getDoc(doc(db, 'posts', slug))

  return transform(postData)
}

export async function setPost({ slug, ...post }: any) {
  return await setDoc(doc(db, 'posts', slug), transformBack(post))
}

export async function deletePost(slug: string | string[]) {
  return await Promise.all(
    (typeof slug === 'string' ? [slug] : slug).map((slug) =>
      deleteDoc(doc(db, 'posts', slug))
    )
  )
}

export function usePosts({
  tag,
  orderBy = 'published_date',
  orderDirection = 'desc',
  onError = console.error,
}: PostQuery = {}) {
  const [posts, setPosts] = useState<Post[]>()

  const queries: QueryConstraint[] = useMemo(() => {
    const queries: QueryConstraint[] = []

    if (tag) {
      queries.push(where('tags', 'array-contains', tag))
    }

    if (orderBy) {
      queries.push(queryOrderBy(orderBy, orderDirection))
    }

    return queries
  }, [tag, orderBy, orderDirection])

  useEffect(() => {
    setPosts(undefined)
    return onSnapshot(
      query(collection(db, 'posts'), ...queries),
      async (querySnapshot) => {
        const posts = await Promise.all(querySnapshot.docs.map(transform))
        setPosts(posts)
      },
      onError
    )
  }, [queries, onError])

  return {
    posts: posts || [],
    loading: !posts,
  }
}

export async function uploadGallery(files: FileList): Promise<PostImage[]> {
  const uploaded = await Promise.all(
    Array.from(files).map(async (file) => {
      const filename = `${uuid.v4()}_${file.name}`
      const path = `posts/${filename}`
      const src = await uploadFile(path, file)

      return { src, path, filename }
    })
  )
  return uploaded
}

const transform = (doc: any) => {
  const { created_date, published_date, ...data } = doc.data()

  const slug = doc.id
  const image = data.gallery && data.gallery[0] ? data.gallery[0] : null

  return {
    ...data,
    slug,
    image,
    created_date: created_date ? created_date.seconds : 0,
    published_date: published_date ? published_date.seconds : 0,
  } as Post
}

const transformBack = ({ ...post }: Post) => {
  return {
    ...post,
    created_date: Timestamp.fromDate(new Date(post.created_date)),
    published_date: Timestamp.fromDate(new Date(post.published_date)),
  }
}
