import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  getFirestore,
  deleteDoc,
  doc,
  limit as limitQuery,
  startAfter,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useUser } from './auth'
import { app } from './firebase'

// TODO ts

const db = getFirestore(app)

export function usePosts(limit = 10, tag = '') {
  const [posts, setPosts] = useState([])
  const [drafts, setDrafts] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [lastVisible, setLastVisible] = useState(null)
  const [nextLastVisible, setNextLastVisible] = useState(null)
  const [noMore, setNoMore] = useState(false)

  const { isLoggedIn } = useUser()

  const getPosts = async (queryArray) => {
    const snapshot = await getDocs(
      query(collection(db, 'posts'), ...queryArray)
    )

    return [
      snapshot.docs.map((doc) => {
        const data = doc.data()
        const { publishedAt, createdAt } = data
        return {
          id: doc.id,
          ...data,
          publishedAt: publishedAt.seconds,
          createdAt: createdAt.seconds,
        }
      }),
      snapshot.docs[snapshot.docs.length - 1],
    ]
  }

  const getQueryArray = (...toPush) => {
    const queryArray = []

    if (tag) queryArray.push(where('tags', 'array-contains', tag))

    queryArray.push(orderBy('publishedAt', 'desc'), limitQuery(limit))

    if (toPush.length) {
      queryArray.push(...toPush)
    }

    return queryArray
  }

  useEffect(async () => {
    if (!isLoggedIn) {
      setDrafts([])
      return
    }

    const [drafts] = await getPosts(
      getQueryArray(where('isPublished', '==', false))
    )

    setDrafts(drafts)
  }, [isLoggedIn, tag, limit])

  useEffect(async () => {
    setLoading(true)

    const queryArray = getQueryArray(where('isPublished', '==', true))

    if (lastVisible) queryArray.push(startAfter(lastVisible))

    const [posts, last] = await getPosts(queryArray)

    setLoading(false)

    if (!posts.length) {
      setNoMore(true)
      return
    }

    setNoMore(false)

    setNextLastVisible(last)
    setPosts((currentPosts) => [...currentPosts, ...posts])
  }, [lastVisible, tag, limit])

  const loadMore = () => setLastVisible(nextLastVisible)

  return {
    posts,
    drafts,
    isLoading,
    loadMore,
    noMore,
  }
}

export async function getPostBySlug(slug) {
  const snapshot = await getDocs(
    query(collection(db, 'posts'), where('slug', '==', slug))
  )

  const doc = snapshot.docs[0]
  const data = doc.data()

  const { publishedAt, createdAt } = data

  return {
    id: doc.id,
    ...data,
    publishedAt: publishedAt.seconds,
    createdAt: createdAt.seconds,
  }
}

export async function deletePost(id) {
  return deleteDoc(doc(db, 'posts', id))
}

export async function getAllPostSlugs() {
  const snapshot = await getDocs(query(collection(db, 'posts')))

  return snapshot.docs.map((doc) => doc.data().slug)
}
