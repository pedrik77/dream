import { db } from '@lib/firebase'
import { QueryBase } from '@lib/types'
import {
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  QueryConstraint,
  setDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

interface CreatorOptions<T, D, Q, TransformOpt = {}> {
  getQuery?: (options: Q) => QueryConstraint[]

  getTransformerFrom?: (
    options?: TransformOpt
  ) => (doc: DocumentSnapshot<D>) => Promise<T>

  getTransformerTo?: (options?: TransformOpt) => (entity: T) => Promise<D>

  getIdKey?: () => keyof T | 'id' | 'uuid'

  defaults?: {
    transformerOptions?: TransformOpt
  }
}

export function create<
  T extends {},
  D = T,
  Q extends QueryBase<T> = {},
  TransformOpt = {}
>(collectionName: string, options?: CreatorOptions<T, D, Q, TransformOpt>) {
  const {
    getQuery = () => [],
    getTransformerFrom = () => async (r: any) => r as T,
    getTransformerTo = () => async (r: any) => r as T,
    getIdKey = () => 'uuid',
    defaults = {},
  } = options || {}

  const id = getIdKey()

  return {
    async get(id: string, transformerOptions = defaults.transformerOptions) {
      const data = await getDoc(doc(db, collectionName, id))

      return await getTransformerFrom(transformerOptions)(
        data as DocumentSnapshot<D>
      )
    },

    async set(entity: T, transformerOptions = defaults.transformerOptions) {
      return await setDoc(
        // @ts-ignore
        doc(db, collectionName, entity[id]),
        getTransformerTo(transformerOptions)(entity)
      )
    },

    async delete(id: string | string[]) {
      return await Promise.all(
        (typeof id === 'string' ? [id] : id).map((id) =>
          deleteDoc(doc(db, collectionName, id))
        )
      )
    },

    async getMany(
      queries: Q,
      transformerOptions = defaults.transformerOptions
    ) {
      const data = await getDocs(
        query(collection(db, collectionName), ...getQuery(queries))
      )

      return await Promise.all(
        data.docs.map((doc) =>
          getTransformerFrom(transformerOptions)(doc as DocumentSnapshot<D>)
        )
      )
    },

    useSubscription(
      queries: Q = {} as Q,
      transformerOptions = defaults.transformerOptions
    ) {
      const [data, setData] = useState<T[]>()

      useEffect(() => {
        setData(undefined)
        return onSnapshot(
          query(collection(db, collectionName), ...getQuery(queries)),
          async (querySnapshot) => {
            const data = await Promise.all(
              querySnapshot.docs.map((doc) => {
                return getTransformerFrom(transformerOptions)(
                  doc as DocumentSnapshot<D>
                )
              })
            )
            setData(data)
          },
          queries.onError
        )
      }, [queries, transformerOptions])

      return {
        data: data || [],
        loading: !data,
      }
    },
  }
}
