import { Button, Container, Text, useUI } from '@components/ui'
import { useShopContext } from '@lib/shop'
import Link from 'next/link'
import React, { useMemo } from 'react'
import CartItem from '../CartItem'

export default function Products({
  onNext = () => {},
  onPrev = () => {},
  sidebar = false,
}) {
  const { cart, total, isEmptyCart } = useShopContext()
  const { closeSidebar } = useUI()

  const handleNext = onNext

  if (isEmptyCart()) return <EmptyCart />

  return (
    <div>
      {!sidebar && (
        <div className="flex justify-end items-center my-8">
          <Button className="w-36" onClick={handleNext}>
            Pokracovat
          </Button>
        </div>
      )}
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
      {sidebar && (
        <div className="flex justify-center items-center my-8">
          <Link href="/cart">
            <a onClick={closeSidebar}>Do kosika</a>
          </Link>
        </div>
      )}
    </div>
  )
}

const EmptyCart = () => (
  <Container className="col-span-full flex flex-col justify-center items-center text-center my-8">
    <Text variant="sectionHeading" className="my-4">
      Košík je prázdny :(
    </Text>
    <Link href="/products">
      <a>Pozriet ponuku</a>
    </Link>
  </Container>
)
