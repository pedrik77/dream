import { Text } from '@components/ui'
import { useShop } from '@lib/shop'
import React, { useMemo } from 'react'
import CartItem from '../CartItem'

export default function Products({ sidebar = false }) {
  const { cart } = useShop()

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
    </div>
  )
}
