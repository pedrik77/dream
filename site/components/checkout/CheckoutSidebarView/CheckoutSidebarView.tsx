import Link from 'next/link'
import { FC, useState } from 'react'
import CartItem from '@components/cart/CartItem'
import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'
import useCart from '@framework/cart/use-cart'
import usePrice from '@framework/product/use-price'
import useCheckout from '@framework/checkout/use-checkout'
import ShippingWidget from '../ShippingWidget'
import PaymentWidget from '../PaymentWidget'
import s from './CheckoutSidebarView.module.css'
import { useCheckoutContext } from '../context'
import { useShop } from '@lib/shop'

const CheckoutSidebarView: FC = () => {
  const { setSidebarView, closeSidebar } = useUI()

  const { cart, total } = useShop()

  return (
    <SidebarLayout
      className={s.root}
      handleBack={() => setSidebarView('CART_VIEW')}
    >
      <div className="px-4 sm:px-6 flex-1">
        <Link href="/cart">
          <a>
            <Text variant="sectionHeading">Checkout</Text>
          </a>
        </Link>

        <PaymentWidget
          isValid={false}
          onClick={() => setSidebarView('PAYMENT_VIEW')}
        />
        <ShippingWidget
          isValid={false}
          onClick={() => setSidebarView('SHIPPING_VIEW')}
        />

        <ul className={s.lineItemsList}>
          {cart.map((item) => (
            <CartItem key={item.product.slug} {...item} />
          ))}
        </ul>
      </div>

      <form
        onSubmit={console.log}
        className="flex-shrink-0 px-6 py-6 sm:px-6 sticky z-20 bottom-0 w-full right-0 left-0 bg-accent-0 border-t text-sm"
      >
        <ul className="pb-2">
          <li className="flex justify-between py-1">
            <span>Taxes</span>
            <span>Calculated at checkout</span>
          </li>
          <li className="flex justify-between py-1">
            <span>Shipping</span>
            <span className="font-bold tracking-wide">FREE</span>
          </li>
        </ul>
        <div className="flex justify-between border-t border-accent-2 py-3 font-bold mb-2">
          <span>Total</span>
          <span>{total}</span>
        </div>
        <div>
          {/* Once data is correctly filled */}
          <Button type="submit" width="100%">
            Confirm Purchase
          </Button>
        </div>
      </form>
    </SidebarLayout>
  )
}

export default CheckoutSidebarView
