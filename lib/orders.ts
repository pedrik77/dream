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
  getDocs,
} from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { CustomerDataType, useAuthContext } from './auth'
import { db } from './firebase'
import { CartItem } from './shop'
import { QueryBase } from './types'

export interface Order {
  uuid: string
  user: string
  items: CartItem[]
  customer: CustomerDataType
  total_price: number
  created_date: number
  mail_sent?: boolean
}

export interface OrderToDraw {
  uuid: string
  email: string
  name: string
  phone: string
  ticketCount: string
}

interface OrdersQuery extends QueryBase<Order> {
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

export function useOrders({
  user,
  orderBy = 'created_date',
  orderDirection = 'desc',
  onError = console.error,
}: OrdersQuery = {}) {
  const [orders, setOrders] = useState<Order[]>([])

  const queries: QueryConstraint[] = useMemo(() => {
    const queries: QueryConstraint[] = []

    if (user) queries.push(where('user', '==', user))

    if (orderBy) queries.push(queryOrderBy(orderBy, orderDirection))

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
        },
        onError
      ),
    [queries, onError]
  )

  return orders
}

export function usePrizes() {
  const { user } = useAuthContext()
  const orders = useOrders({
    user: user?.email || '',
  })

  return useMemo(() => {
    const productMap: {
      [index: string]: {
        product: string
        ticket_count: number
        last_order_date: number
      }
    } = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productMap[item.product.slug]) {
          productMap[item.product.slug] = {
            product: item.product.title_1,
            ticket_count: item.ticketCount,
            last_order_date: order.created_date,
          }
        } else {
          productMap[item.product.slug].ticket_count += item.ticketCount
        }
      })
    })

    return Object.entries(productMap).map(
      ([slug, { product, ticket_count, last_order_date }]) => ({
        slug,
        product,
        ticket_count,
        last_order_date,
      })
    )
  }, [orders])
}

export async function getOrdersToDraw(
  productSlug: string
): Promise<OrderToDraw[]> {
  const snapshot = await getDocs(
    query(
      collection(db, 'orders'),
      where('products', 'array-contains', productSlug)
    )
  )

  return snapshot.docs.map((doc) => {
    const { customer, items } = doc.data()

    const item = items.find((i: CartItem) => i.product.slug === productSlug)

    return {
      uuid: doc.id,
      email: customer.email,
      name: customer.fullname,
      phone: customer.phone,
      ticketCount: item.ticketCount,
    }
  })
}

function transform(doc: any): Order {
  const { created_date, ...data } = doc.data()

  return {
    ...data,
    uuid: doc.id,
    created_date: created_date.seconds,
  }
}
