import { Product } from '@lib/products'
import { Timestamp } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { today } from './date'
import useLoading from './hooks/useLoading'
import { setOrder } from './orders'
import { v4 as uuid4 } from 'uuid'
import { useUser } from './auth'

const CART_STORAGE_KEY = 'cart'

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
  const [cart, setCart] = useState<CartItem[]>([])

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price, 0),
    [cart]
  )

  const loading = useLoading()

  const { user } = useUser()

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)

    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  console.log({ cart })

  const addToCart = async (
    product: Product,
    ticketCount: number,
    price: number
  ) => {
    const inCart = cart.find(({ product: { slug } }) => slug === product.slug)

    if (inCart)
      return setCart(
        cart.map((item) =>
          item.product.slug === product.slug
            ? {
                ...item,
                ticketCount: item.ticketCount + ticketCount,
                price: item.price + price,
              }
            : item
        )
      )

    return setCart((cart) => [
      ...cart,
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

  const removeFromCart = (productSlug: string) =>
    setCart(cart.filter(({ product: { slug } }) => slug !== productSlug))

  const placeOrder = (product: Product, ticketCount: number, price: number) =>
    setOrder({
      uuid: uuid4(),
      user_id: user?.uid,
      items: [
        {
          product_slug: product.slug,
          ticket_count: ticketCount,
        },
      ],
      total_price: price,
      created_date: Timestamp.fromDate(new Date(today())),
    })

  return {
    cart,
    total,
    loading: loading.pending,
    addToCart,
    removeFromCart,
    placeOrder,
  }
}
