import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy as queryOrderBy,
  QueryConstraint,
  setDoc,
  where,
} from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { CustomerDataType, useAuthContext } from './auth'
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
  orderBy?: keyof Order
  orderDirection?: 'asc' | 'desc'
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

export function useOrders({
  user,
  orderBy,
  orderDirection = 'asc',
}: UseOrdersOptions = {}) {
  const [orders, setOrders] = useState<Order[]>([])

  const queries: QueryConstraint[] = useMemo(() => {
    const queries: QueryConstraint[] = []

    if (user) {
      queries.push(where('user', '==', user))
    }

    if (orderBy) {
      queries.push(queryOrderBy(orderBy, orderDirection))
    }

    return queries
  }, [user, orderBy, orderDirection])

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

export function usePrizes() {
  const { user } = useAuthContext()
  const orders = useOrders({
    user: user?.email || '',
    orderBy: 'created_date',
    orderDirection: 'desc',
  })

  return useMemo(() => {
    const productMap: { [index: string]: any } = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productMap[item.product.slug]) {
          productMap[item.product.slug] = {
            product: item.product.title_1,
            ticketCount: item.ticketCount,
          }
        } else {
          productMap[item.product.slug].ticketCount += item.ticketCount
        }
      })
    })

    return Object.entries(productMap).map(
      ([slug, { product, ticketCount }]) => ({
        slug,
        product,
        ticketCount,
      })
    )
  }, [orders])
}

function transform(doc: any): Order {
  const { created_date, ...data } = doc.data()

  return {
    ...data,
    uuid: doc.id,
    created_date: created_date.seconds,
  }
}
