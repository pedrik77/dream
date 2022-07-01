import { useShop } from '@lib/shop'
import React, { useMemo } from 'react'

export default function Products() {
  const { cart } = useShop()

  return (
    <div>
      <h1>Tunak</h1>
      <div>
        {cart.map(({ product, ticketCount, price }) => (
          <div key={product.slug}>{product.title}</div>
        ))}
      </div>
    </div>
  )
}
