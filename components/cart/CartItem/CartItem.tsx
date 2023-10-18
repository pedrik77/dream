import { Cross } from '@components/icons'
import { Button, Container, Text } from '@components/ui'
import { CartItem as ICartItem, useShopContext } from '@lib/api/shop/context'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import s from './CartItem.module.css'
import { t } from 'i18next'

interface CartItemProps extends ICartItem {
  sidebar?: boolean
}

export default function CartItem({
  product,
  ticketCount,
  price,
  sidebar = false,
}: CartItemProps) {
  const { removeFromCart } = useShopContext()

  const handleRemove = () => removeFromCart(product.slug)

  const router = useRouter()

  return (
    <div className={sidebar ? s.sidebar : s.root}>
      <div className={s.productDiv}>
        <div className={s.imageContainer}>
          <Image
            height={195}
            width={300}
            layout="responsive"
            alt="productImage"
            src={product.image}
            className="rounded-md"
          />
        </div>
        <div className={s.productInfoDiv}>
          <span className="text-2xl md:text-3xl font-bold ">
            {ticketCount} tiketov
          </span>
          <Text
            variant="sectionHeading"
            onClick={() => router.push(`/products/${product.slug}`)}
          >
            {product.title_1}
          </Text>
          <span className="text-base m-0 left">
            {t('product.support')} {product.title_2}
          </span>
        </div>
      </div>

      <div className={s.priceDiv}>
        <Text variant="sectionHeading">{price} € </Text>
        <div className={s.crossDiv}>
          <Button onClick={handleRemove} variant="naked" className="primary">
            <Cross className="text-primary" />
          </Button>
        </div>
      </div>
    </div>
  )
}
