import { Product } from '@lib/products'
import { collection, doc, onSnapshot, Timestamp } from 'firebase/firestore'
import { createContext, useEffect, useMemo, useState } from 'react'
import { today } from './date'
import useLoading from './hooks/useLoading'
import { setOrder } from './orders'
import { v4 as uuid4 } from 'uuid'
import { useUser } from './auth'
import { useSkipFirst } from './hooks/useSkipFirst'
import { db } from './firebase'

const CART_STORAGE_KEY = 'cart'
const CUSTOMER_STORAGE_KEY = 'cart'

export interface CartItem {
  product: {
    slug: string
    title_1: string
    title_2: string
    image: string
  }
  ticketCount: number
  price: number
}

export const useShop = () => {
  const { customer, user, setCustomer } = useUser()

  const [cart, setCart] = useState<CartItem[]>([])

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price, 0),
    [cart]
  )

  const loading = useLoading()

  const skipFirst = useSkipFirst()

  const cartId = useMemo(() => user?.email || uuid4(), [user])

  useEffect(
    () =>
      onSnapshot(doc(db, 'cart', cartId), (querySnapshot) => {
        setCart(
          // @ts-ignore
          querySnapshot.docs.map(transform)
        )
      }),
    [cartId]
  )

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)
    const storedCustomer = sessionStorage.getItem(CUSTOMER_STORAGE_KEY)

    if (storedCustomer) setCustomer(JSON.parse(storedCustomer))
  }, [setCustomer])

  useEffect(
    () =>
      sessionStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer)),
    [cart, customer, skipFirst]
  )

  const addToCart = async (
    product: Product,
    ticketCount: number,
    price: number,
    forceOverride = false
  ) => {
    const inCart = isInCart(product.slug)

    if (inCart && !forceOverride) throw new Error('Already in cart')

    return setCart((cart) => [
      ...cart.filter(({ product: { slug } }) => slug !== product.slug),
      {
        product: {
          title_1: product.title_1,
          title_2: product.title_2,
          slug: product.slug,
          image: product.gallery[0].src,
        },
        ticketCount,
        price,
      },
    ])
  }

  const isInCart = (productSlug: string) =>
    !!cart.find(({ product: { slug } }) => slug === productSlug)

  const removeFromCart = (productSlug: string) =>
    setCart((cart) =>
      cart.filter(({ product: { slug } }) => slug !== productSlug)
    )

  const clearCart = () => {
    setCart([])
    localStorage.removeItem(CART_STORAGE_KEY)
    sessionStorage.removeItem(CUSTOMER_STORAGE_KEY)
  }

  const isEmptyCart = () => !cart.length

  const placeOrder = () =>
    setOrder({
      uuid: uuid4(),
      user_uid: user?.uid,
      items: cart,
      total_price: total,
      customer,
      created_date: Timestamp.fromDate(new Date(today())),
    })

  return {
    cart,
    total,
    loading: loading.pending,
    addToCart,
    clearCart,
    isInCart,
    isEmptyCart,
    removeFromCart,
    placeOrder,
  }
}
