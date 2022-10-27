import { page } from '@lib/api'
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
import { SetStateAction, useEffect, useState } from 'react'
import { v4 as uuid4 } from 'uuid'

export type FileType = {
  src: string
  path: string
  filename: string
}

interface CreatorOptions<T, D, Q, TransformOpt = {}> {
  getQuery?: (options: Q) => QueryConstraint[]

  getTransformerFrom?: (
    options?: TransformOpt
  ) => (doc: DocumentSnapshot<D>) => Promise<T>

  getTransformerTo?: (options?: TransformOpt) => (entity: T) => Promise<D>

  getIdKey?: () => keyof T | 'id' | 'uuid'

  defaults?: {
    transformerOptions?: TransformOpt
    storageName?: string
  }
}

export type Transformable<T, E> = E & T

export function create<
  T extends {},
  Doc = T,
  Q extends QueryBase<T> = {},
  TransformOpt = {}
>(collectionName: string, options?: CreatorOptions<T, Doc, Q, TransformOpt>) {
  const {
    getQuery = () => [],
    getTransformerFrom = () => async (r: any) => r as T,
    getTransformerTo = () => async (r: any) => r as Doc,
    getIdKey = () => 'uuid',
    defaults = {},
  } = options || {}

  const id = getIdKey()

  return {
    async set(entity: T, transformerOptions = defaults.transformerOptions) {
      console.log('set', entity)

      const transformer = getTransformerTo(transformerOptions)

      const docData = await transformer(entity)

      return await setDoc(
        // @ts-ignore
        doc(db, collectionName, entity[id]),
        // @ts-ignore
        docData
      )
    },

    async delete(id: string | string[]) {
      return await Promise.all(
        (typeof id === 'string' ? [id] : id).map((id) =>
          deleteDoc(doc(db, collectionName, id))
        )
      )
    },

    get: {
      async one(id: string, transformerOptions = defaults.transformerOptions) {
        const data = await getDoc(doc(db, collectionName, id))

        return await getTransformerFrom(transformerOptions)(
          data as DocumentSnapshot<Doc>
        )
      },

      async many(queries: Q, transformerOptions = defaults.transformerOptions) {
        const data = await getDocs(
          query(collection(db, collectionName), ...getQuery(queries))
        )

        return await Promise.all(
          data.docs.map((doc) =>
            getTransformerFrom(transformerOptions)(doc as DocumentSnapshot<Doc>)
          )
        )
      },
    },

    useSubscription(
      queries: Q = {} as Q,
      transformerOptions = defaults.transformerOptions
    ) {
      const [data, setData] = useState<T[]>()
      const [refresh, setRefresh] = useState(false)

      const doRefresh: SetStateAction<void> = () => setRefresh((r) => !r)

      useEffect(() => {
        setData(undefined)

        return onSnapshot(
          query(collection(db, collectionName), ...getQuery(queries)),
          async (querySnapshot) => {
            const data = await Promise.all(
              querySnapshot.docs.map((doc) => {
                return getTransformerFrom(transformerOptions)(
                  doc as DocumentSnapshot<Doc>
                )
              })
            )
            setData(data)
          },
          queries.onError
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [refresh])

      return {
        data: data || [],
        loading: !data,
        refresh: doRefresh,
      }
    },

    uploadFiles: async (
      files: FileList,
      storageName = defaults.storageName || ''
    ): Promise<FileType[]> => {
      const uploaded = await Promise.all(
        Array.from(files).map(async (file) => {
          const filename = `${uuid4()}_${file.name}`
          const path = `${collectionName}/${storageName}${
            !!storageName ? '/' : ''
          }${filename}`
          const src = await page.files.upload(path, file)

          return { src, path, filename }
        })
      )
      return uploaded
    },
  }
}
