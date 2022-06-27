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
import Link from 'next/link'
import { Product } from '@lib/products'

interface ProductSidebarProps {
  product: Product
  onJoinNow?: () => void
}

const ProductSidebar: FC<ProductSidebarProps> = ({
  product,
  onJoinNow = () => {},
}) => {
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
    <div className={s.sidebar}>
      <Link href="#">
        <a>
          <h5 className={s.category}>Kategoria</h5>
        </a>
      </Link>
      <ProductTag name={product.title_1} />
      <h4 className={s.subtitle}>
        Jelly dessert icing caramels biscuit tootsie.
      </h4>
      <Text
        className="pb-4 break-words w-full max-w-xl"
        html={product.short_desc}
      />
      <div className={s.info}>
        <div>
          <span className={s.infoTitle}>Closes</span>
          <span>12.12.2022</span>
        </div>
        <div>
          <span className={s.infoTitle}>Winner Announcement</span>
          <span>20.12.2022</span>
        </div>
      </div>
      {/* TODO Toto ten button neviem */}
      <div className="flex justify-center">
        <Button
          onClick={onJoinNow}
          type="button"
          className={(s.button, 'my-5')}
        >
          Join now
        </Button>
      </div>
    </div>
  )
}

export default ProductSidebar
