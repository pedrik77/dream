import { Text } from '@components/ui'
import { useShop } from '@lib/shop'
import React, { useMemo } from 'react'
import CartItem from '../CartItem'

export default function Products({ sidebar = false }) {
  const { cart, total } = useShop()

  return (
    <div>
      <Text variant="sectionHeading" className="my-4">
        Produkty
      </Text>
      <div>
        {cart.map((item) => (
          <CartItem key={item.product.slug} {...item} />
        ))}
      </div>
      <div className="flex justify-between border-t-0 border-primary">
        <Text variant="sectionHeading">Spolu</Text>
        <Text variant="sectionHeading">{total} €</Text>
      </div>
    </div>
  )
}
