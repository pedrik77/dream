import { Button, Container, Text, useUI } from '@components/ui'
import { useShopContext } from '@lib/shop'
import Link from 'next/link'
import React, { useMemo } from 'react'
import CartItem from '../CartItem'
import s from './Products.module.css'

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
    <div className={sidebar ? s.sidebar : ''}>
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
          <CartItem key={item.product.slug} {...item} sidebar={sidebar} />
        ))}
      </div>
      <div className={s.total}>
        <Text variant="sectionHeading">Spolu</Text>
        <Text variant="sectionHeading">{total} €</Text>
      </div>
      {sidebar && (
        <div className={s.toCartBtn}>
          <Link href="/cart">
            <a onClick={closeSidebar}>Do kosika</a>
          </Link>
        </div>
      )}
    </div>
  )
}

const EmptyCart = () => (
  <Container className={s.emptyContainer}>
    <Text variant="sectionHeading" className="my-4">
      Košík je prázdny :(
    </Text>
    <Link href="/products">
      <a>Pozriet ponuku</a>
    </Link>
  </Container>
)
