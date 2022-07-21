import { Product } from '@lib/products'
import {
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { createContext, useEffect, useMemo, useState } from 'react'
import { today } from './date'
import useLoading from './hooks/useLoading'
import { setOrder } from './orders'
import { v4 as uuid4 } from 'uuid'
import { useAuth } from './auth'
import { db } from './firebase'
import { handleErrorFlash } from '@components/ui/FlashMessage'

const CART_STORAGE_KEY = 'cart'
const CUSTOMER_STORAGE_KEY = 'customer'

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

const saveCart = (cartId: string, cart: any[]) =>
  setDoc(doc(db, 'cart', cartId), { data: cart })

const getCartId = (email: string = '') => {
  if (typeof window === 'undefined') return ''

  const storedId = localStorage.getItem(CART_STORAGE_KEY)

  if (storedId) return storedId

  const cartId = email || uuid4()

  localStorage.setItem(CART_STORAGE_KEY, cartId)

  return cartId
}

export const deleteCart = (cartId: string) => deleteDoc(doc(db, 'cart', cartId))

export const useShop = () => {
  const { customer, user, setCustomer } = useAuth()

  const [cart, setCart] = useState<CartItem[]>([])

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price, 0),
    [cart]
  )

  const loading = useLoading(true)

  const cartId = useMemo(() => getCartId(customer.email), [customer.email])

  useEffect(
    () =>
      onSnapshot(doc(db, 'cart', cartId), (querySnapshot) => {
        setCart(
          // @ts-ignore
          querySnapshot.data()?.data || []
        )
        loading.stop()
      }),
    [cartId, loading]
  )

  useEffect(() => {
    const storedCustomer = sessionStorage.getItem(CUSTOMER_STORAGE_KEY)

    if (storedCustomer) setCustomer(JSON.parse(storedCustomer))
  }, [setCustomer])

  useEffect(
    () =>
      sessionStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer)),
    [customer]
  )

  const addToCart = async (
    product: Product,
    ticketCount: number,
    price: number,
    forceOverride = false
  ) => {
    const inCart = isInCart(product.slug)

    if (inCart && !forceOverride) throw new Error('Already in cart')

    return saveCart(cartId, [
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
    saveCart(
      cartId,
      cart.filter(({ product: { slug } }) => slug !== productSlug)
    )

  const clearCart = () => {
    saveCart(cartId, []).catch((e) => {})

    sessionStorage.removeItem(CART_STORAGE_KEY)
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
