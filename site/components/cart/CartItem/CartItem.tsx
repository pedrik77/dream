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

export default function CartItem({ product, ticketCount, price }: ICartItem) {
  return (
    <div className="col-span-12 flex flex-col md:flex-row gap-2 my-4 py-4 justify-between border-b border-primary">
      <div className="flex flex-row gap-4 md:gap-8">
        <Image
          height={195}
          width={300}
          alt="productImage"
          src={product.image}
          className="rounded-md"
        />
        <div className="flex flex-col center text-left">
          <span className="text-3xl font-bold ">{ticketCount} tiketov</span>
          <Text
            variant="sectionHeading"
            onClick={() => router.push(`/products/${product.slug}`)}
          >
            {product.title_1}
          </Text>
          <span className="text-base m-0 left">{product.title_2}</span>
        </div>
      </div>

      <div className="flex gap-6 md:gap-12 items-center justify-center md:justify-start ">
        <Text variant="sectionHeading">{price} € </Text>
        <div className="flex center items-center">
          <Button onClick={handleRemove} variant="naked">
            <Cross />
          </Button>
        </div>
      </div>
    </div>
  )
}
