import { Product } from '@lib/products'
import { Timestamp } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { today } from './date'
import useLoading from './hooks/useLoading'
import { setOrder } from './orders'
import { v4 as uuid4 } from 'uuid'
import { useUser } from './auth'

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
  const { customer, user } = useUser()

  const [cart, setCart] = useState<CartItem[]>([])
  const [customerData, setCustomerData] = useState({
    ...customer,
    email: user?.email || '@',
  })

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price, 0),
    [cart]
  )

  const loading = useLoading()

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)
    const storedCustomer = sessionStorage.getItem(CUSTOMER_STORAGE_KEY)

    if (storedCart) setCart(JSON.parse(storedCart))

    if (storedCustomer) setCustomerData(JSON.parse(storedCustomer))
  }, [])

  useEffect(() => {
    console.log('Saving cart, customer data', cart, customerData)

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))

    sessionStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerData))

    console.log({ cart, customerData })
  }, [cart, customerData])

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
    setCart(cart.filter(({ product: { slug } }) => slug !== productSlug))

  const isEmptyCart = !cart.length

  const placeOrder = (items: CartItem[], ticketCount: number, price: number) =>
    setOrder({
      uuid: uuid4(),
      user_id: user?.uid,
      items,
      total_price: price,
      created_date: Timestamp.fromDate(new Date(today())),
    })

  return {
    cart,
    total,
    loading: loading.pending,
    addToCart,
    isEmptyCart,
    customerData,
    setCustomerData,
    removeFromCart,
    placeOrder,
  }
}
