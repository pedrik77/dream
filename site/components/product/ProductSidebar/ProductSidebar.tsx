import s from './ProductSidebar.module.css'
import { useAddItem } from '@framework/cart'
import { FC, useEffect, useState } from 'react'
import { ProductOptions } from '@components/product'
import { Button, Text, Rating, Collapse, useUI } from '@components/ui'
import {
  getProductVariant,
  selectDefaultOptionFromProduct,
  SelectedOptions,
} from '../helpers'
import ProductTag from '../ProductTag'
import { Product } from '@lib/products'

interface ProductSidebarProps {
  product: Product
  className?: string
}

const ProductSidebar: FC<ProductSidebarProps> = ({ product, className }) => {
  const addItem = useAddItem()
  const { openSidebar } = useUI()
  const [loading, setLoading] = useState(false)

  const addToCart = async () => {
    setLoading(true)
    try {
      await addItem({
        productId: String(product.slug),
      })
      openSidebar()
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <ProductTag name={product.title_1} />

      <Text
        className="pb-4 break-words w-full max-w-xl"
        html={product.short_desc}
      />
      <div className="flex flex-row justify-between items-center">
        <Rating value={4} />
        <div className="pr-1 font-medium text-sm">36 reviews</div>
      </div>
      <div>
        {process.env.COMMERCE_CART_ENABLED && (
          <Button
            aria-label="Add to Cart"
            type="button"
            className={s.button}
            onClick={addToCart}
            loading={loading}
          >
            Add To Cart
          </Button>
        )}
      </div>
      <div className="mt-6">
        <Collapse title="Care">
          This is a limited edition production run. Printing starts when the
          drop ends.
        </Collapse>
        <Collapse title="Details">
          This is a limited edition production run. Printing starts when the
          drop ends. Reminder: Bad Boys For Life. Shipping may take 10+ days due
          to COVID-19.
        </Collapse>
      </div>

      {/* TODO Toto ten button neviem */}
      <div className="flex justify-center">
        <Button type="button" className={(s.button, 'my-5')}>
          Join now
        </Button>
      </div>
    </div>
  )
}

export default ProductSidebar
