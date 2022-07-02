import { Container, Text } from '@components/ui'
import { CartItem as ICartItem } from '@lib/shop'
import Image from 'next/image'
import React from 'react'

export default function CartItem({ product, ticketCount, price }: ICartItem) {
  return (
    <Container clean className="flex center items-stretch">
      <Image height={195} width={300} alt="productImage" src={product.image} />
      <div className="flex gap-4 center items-stretch">
        <Text variant="heading">{ticketCount}</Text>
        <Text>{product.title_1}</Text>
        <Text>{product.title_2}</Text>
      </div>
      <Text variant="heading">{price}</Text>
    </Container>
  )
}
