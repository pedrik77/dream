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
import useLoading from './hooks/useLoading'
import { setOrder } from './orders'
import { v4 as uuid4 } from 'uuid'
import { useAuthContext } from './auth'
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

type ContextType = {
  cart: CartItem[]
  total: number
  loading: boolean
  addToCart: () => Promise<void>
  clearCart: () => Promise<void>
  isInCart: () => boolean
  isEmptyCart: () => boolean
  removeFromCart: () => Promise<void>
  placeOrder: () => Promise<void>
}

const Context = createContext<ContextType>({
  cart: [],
  total: 0,
  loading: false,
  addToCart: async () => {},
  clearCart: async () => {},
  isInCart: () => false,
  isEmptyCart: () => true,
  removeFromCart: async () => {},
  placeOrder: async () => {},
})

export const ShopProvider: React.FC = ({ children }) => {
  const { customer, user, setCustomer } = useAuthContext()

  const [cart, setCart] = useState<CartItem[]>([])

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price, 0),
    [cart]
  )

  const loading = useLoading(true)

  const cartId = useMemo(() => getCartId(), [])

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
    if (!customer.email) return

    const storedCustomer = sessionStorage.getItem(CUSTOMER_STORAGE_KEY)

    if (storedCustomer) setCustomer(JSON.parse(storedCustomer))
  }, [customer, setCustomer])

  useEffect(
    () =>
      sessionStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer)),
    [customer]
  )

  const addToCart = async (
    { slug, title_1, title_2, gallery }: Product,
    ticketCount: number,
    price: number,
    forceOverride = false
  ) => {
    const inCart = isInCart(slug)

    if (inCart && !forceOverride) throw new Error('Already in cart')

    return saveCart(getCartId(), [
      ...cart.filter(({ product }) => slug !== product.slug),
      {
        product: {
          title_1: title_1,
          title_2: title_2,
          slug: slug,
          image: gallery[0].src,
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
      getCartId(),
      cart.filter(({ product: { slug } }) => slug !== productSlug)
    )

  const clearCart = async () => {
    await saveCart(getCartId(), []).catch((e) => {})
    sessionStorage.removeItem(CUSTOMER_STORAGE_KEY)
  }

  const isEmptyCart = () => !cart.length

  const placeOrder = () =>
    setOrder({
      uuid: uuid4(),
      user_uid: user?.uid || '',
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
        loading: loading.pending,
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

const getCartId = () => {
  if (typeof window === 'undefined') return ''

  const storedId = localStorage.getItem(CART_STORAGE_KEY)

  if (storedId) return storedId

  const cartId = uuid4()

  localStorage.setItem(CART_STORAGE_KEY, cartId)

  return cartId
}

export const deleteCart = (cartId: string) => deleteDoc(doc(db, 'cart', cartId))
