import { Product } from '@lib/products'
import { Timestamp } from 'firebase/firestore'
import { useMemo, useState } from 'react'
import { today } from './date'
import useLoading from './hooks/useLoading'
import { setOrder } from './orders'
import { v4 as uuid4 } from 'uuid'
import { useUser } from './auth'

interface CartItem {
  product: {
    slug: string
    title: string
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

  const addToCart = async (
    product: Product,
    ticketCount: number,
    price: number
  ) => {
    if (cart.find(({ product: { slug } }) => slug === product.slug))
      throw new Error('Product already in cart')

    return setCart((cart) => [
      ...cart,
      {
        product: {
          title: product.title_1,
          slug: product.slug,
          image: product.gallery[0].src,
        },
        ticketCount,
        price,
      },
    ])
  }

  const removeFromCart = (product: Product) =>
    setCart(cart.filter(({ product: { slug } }) => slug !== product.slug))

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
