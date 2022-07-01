import { collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { db } from './firebase'

export interface Item {
  product_slug: string
  ticket_count: number
}

export interface Address {}

export interface Order {
  uuid: string
  user_id: string
  items: Item[]
  address: Address
  total_price: number
  created_date: number
}

export async function getOrder(uuid: string): Promise<Order> {
  const orderDoc = await getDoc(doc(db, 'orders', uuid))

  return transform(orderDoc)
}

export async function setOrder({ uuid, ...order }: any) {
  return await setDoc(doc(db, 'orders', uuid), order)
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(
    () =>
      onSnapshot(collection(db, 'orders'), (querySnapshot) => {
        setOrders(
          // @ts-ignore
          querySnapshot.docs.map(transform)
        )
      }),
    []
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
