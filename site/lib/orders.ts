import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  QueryConstraint,
  setDoc,
  where,
} from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { CustomerDataType } from './auth'
import { db } from './firebase'
import { CartItem } from './shop'

export interface Order {
  uuid: string
  user: string
  items: CartItem[]
  customer: CustomerDataType
  total_price: number
  created_date: number
}

interface UseOrdersOptions {
  user?: string
}

export async function getOrder(uuid: string): Promise<Order> {
  const orderDoc = await getDoc(doc(db, 'orders', uuid))

  return transform(orderDoc)
}

export async function setOrder({ uuid, ...order }: any) {
  return await setDoc(doc(db, 'orders', uuid), {
    ...order,
    products: order.items.map((i: any) => i.product.slug),
  })
}

export function useOrders({ user }: UseOrdersOptions = {}) {
  const [orders, setOrders] = useState<Order[]>([])

  const queries: QueryConstraint[] = useMemo(() => {
    const queries: QueryConstraint[] = []

    if (user) {
      queries.push(where('user', '==', user))
    }

    return queries
  }, [user])

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'orders'), ...queries),
        (querySnapshot) => {
          setOrders(
            // @ts-ignore
            querySnapshot.docs.map(transform)
          )
        }
      ),
    [queries]
  )

  return orders
}

function transform(doc: any): Order {
  const { created_date, ...data } = doc.data()

  return {
    ...data,
    uuid: doc.id,
    created_date: created_date.seconds,
  }
}
