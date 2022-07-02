import { Cross } from '@components/icons'
import { Button, Container, Text } from '@components/ui'
import { CartItem as ICartItem, useShop } from '@lib/shop'
import Image from 'next/image'
import React from 'react'

export default function CartItem({ product, ticketCount, price }: ICartItem) {
  const { removeFromCart } = useShop()

  const handleRemove = () => removeFromCart(product.slug)

  return (
    <div className="flex col-span-12 my-4 justify-between">
      <div className="flex gap-4">
        <Image
          height={195}
          width={300}
          alt="productImage"
          src={product.image}
          className="rounded-md"
        />
        <div className="* flex flex-col gap-4 center">
          <Text variant="heading">{ticketCount}</Text>
          <Text>{product.title_1}</Text>
          <Text>{product.title_2}</Text>
        </div>
      </div>

      <Text variant="heading">{price}</Text>
      <div className="flex center">
        <Button onClick={handleRemove}>
          <Cross />
        </Button>
      </div>
    </div>
  )
}
