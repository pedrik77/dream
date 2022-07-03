import { Cross } from '@components/icons'
import { Button, Container, Text } from '@components/ui'
import { CartItem as ICartItem, useShop } from '@lib/shop'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

export default function CartItem({ product, ticketCount, price }: ICartItem) {
  const { removeFromCart } = useShop()

  const handleRemove = () => removeFromCart(product.slug)

  const router = useRouter()

  return (
    <div className="col-span-12 flex flex-col md:flex-row gap-2 my-4 py-8 items-center justify-between border-none md:border-b md:border-primary">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 pb-4 md:pb-0 max-w-lg">
        <Image
          height={195}
          width={300}
          alt="productImage"
          src={product.image}
          className="rounded-md"
        />
        <div className="flex flex-col center text-left">
          <span className="text-2xl md:text-3xl font-bold ">
            {ticketCount} tiketov
          </span>
          <Text
            variant="sectionHeading"
            onClick={() => router.push(`/products/${product.slug}`)}
          >
            {product.title_1}
          </Text>
          <span className="text-base m-0 left">{product.title_2}</span>
        </div>
      </div>

      <div className="flex gap-4 md:gap-12 items-center justify-center md:justify-start border-t border-secondary md:border-none pt-4 md:pt-0">
        <Text variant="sectionHeading">{price} € </Text>
        <div className="flex center items-center border-l-2 border-primary md:border-none pl-4 md:pl-0">
          <Button onClick={handleRemove} variant="naked" className="primary">
            <Cross />
          </Button>
        </div>
      </div>
    </div>
  )
}
