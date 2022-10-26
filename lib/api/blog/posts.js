import { handleErrorFlash } from '@components/ui/FlashMessage'
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
import { useCallback, useEffect, useState } from 'react'
import { useAuthContext } from '../page/auth'
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

  const { isLoggedIn } = useAuthContext()

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

  const getQueryArray = useCallback(
    (...toPush) => {
      const queryArray = []

      if (tag) queryArray.push(where('tags', 'array-contains', tag))

      queryArray.push(orderBy('publishedAt', 'desc'), limitQuery(limit))

      if (toPush.length) {
        queryArray.push(...toPush)
      }

      return queryArray
    },
    [limit, tag]
  )

  useEffect(() => {
    if (!isLoggedIn) {
      setDrafts([])
      return
    }

    getPosts(getQueryArray(where('isPublished', '==', false)))
      .then(([drafts]) => setDrafts(drafts))
      .catch(handleErrorFlash)
  }, [isLoggedIn, tag, limit, getQueryArray])

  useEffect(() => {
    setLoading(true)

    const queryArray = getQueryArray(where('isPublished', '==', true))

    if (lastVisible) queryArray.push(startAfter(lastVisible))

    getPosts(queryArray)
      .then(([posts, last]) => {
        if (!posts.length) {
          setNoMore(true)
          return
        }

        setNoMore(false)

        setNextLastVisible(last)
        setPosts((currentPosts) => [...currentPosts, ...posts])
      })
      .catch(handleErrorFlash)
      .finally(() => setLoading(false))
  }, [lastVisible, tag, limit, getQueryArray])

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
