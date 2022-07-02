import { Container, Text } from '@components/ui'
import { CartItem as ICartItem } from '@lib/shop'
import React from 'react'

export default function CartItem({ product, ticketCount, price }: ICartItem) {
  return (
    <Container clean>
      <Text>{product.title}</Text>
      <Text>{ticketCount}</Text>
    </Container>
  )
}
