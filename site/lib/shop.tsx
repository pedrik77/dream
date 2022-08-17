import { Product } from '@lib/products'
import {
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { today } from './date'
import { setOrder } from './orders'
import * as uuid from 'uuid'
import { useAuthContext } from './auth'
import { db } from './firebase'

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

type AddToCartParams = {
  product: Product
  ticketCount: number
  price: number
  forceOverride?: boolean
}

type ContextType = {
  cart: CartItem[]
  total: number
  addToCart: (args: AddToCartParams) => Promise<void>
  clearCart: () => Promise<void>
  isInCart: (productSlug: string) => boolean
  isEmptyCart: () => boolean
  removeFromCart: (productSlug: string) => Promise<void>
  placeOrder: () => Promise<void>
}

const Context = createContext<ContextType>({
  cart: [],
  total: 0,
  addToCart: async () => {},
  clearCart: async () => {},
  isInCart: () => false,
  isEmptyCart: () => true,
  removeFromCart: async () => {},
  placeOrder: async () => {},
})

export const ShopProvider: React.FC = ({ children }) => {
  const { customer, user } = useAuthContext()

  const [cart, setCart] = useState<CartItem[]>([])

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price, 0),
    [cart]
  )

  const cartId = useMemo(getCartId, [])

  useEffect(
    () =>
      onSnapshot(
        doc(db, 'cart', cartId),
        (querySnapshot) => {
          setCart(
            // @ts-ignore
            querySnapshot.data()?.data || []
          )
          // loading.stop()
        },
        console.error
      ),
    [cartId]
  )

  const addToCart = async ({
    product: { slug, title_1, title_2, image },
    ticketCount,
    price,
    forceOverride = false,
  }: AddToCartParams) => {
    const inCart = isInCart(slug)

    if (inCart && !forceOverride) throw new Error('Already in cart')

    return saveCart(cartId, [
      ...cart.filter(({ product }) => slug !== product.slug),
      {
        product: {
          title_1,
          title_2,
          slug,
          image: image?.src || '',
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

  const clearCart = () => saveCart(cartId, []).catch((e) => {})

  const isEmptyCart = () => !cart.length

  const placeOrder = () =>
    setOrder({
      uuid: uuid.v4(),
      user: user?.email || '',
      items: cart,
      total_price: total,
      customer,
      created_date: Timestamp.fromDate(new Date(today())),
    })

  return (
    <Context.Provider
      value={{
        cart,
        total,
        addToCart,
        clearCart,
        isInCart,
        isEmptyCart,
        removeFromCart,
        placeOrder,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useShopContext = () => useContext(Context)

const saveCart = (cartId: string, cart: any[]) =>
  setDoc(doc(db, 'cart', cartId), { data: cart })

const getCartId = (email: string = '') => {
  if (typeof window === 'undefined') return ''

  const storedId = localStorage.getItem(CART_STORAGE_KEY)

  if (storedId) return storedId

  const cartId = email || uuid.v4()

  localStorage.setItem(CART_STORAGE_KEY, cartId)

  return cartId
}

export const deleteCart = (cartId: string) => deleteDoc(doc(db, 'cart', cartId))
