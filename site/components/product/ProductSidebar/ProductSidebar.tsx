import s from './ProductSidebar.module.css'
import { useAddItem } from '@framework/cart'
import { FC, useEffect, useState } from 'react'
import { ProductOptions } from '@components/product'
import type { Product } from '@commerce/types/product'
import { Button, Text, Rating, Collapse, useUI } from '@components/ui'
import {
  getProductVariant,
  selectDefaultOptionFromProduct,
  SelectedOptions,
} from '../helpers'
import ProductTag from '../ProductTag'

interface ProductSidebarProps {
  product: Product
  className?: string
}

const ProductSidebar: FC<ProductSidebarProps> = ({ product, className }) => {
  const addItem = useAddItem()
  const { openSidebar } = useUI()
  const [loading, setLoading] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})

  useEffect(() => {
    selectDefaultOptionFromProduct(product, setSelectedOptions)
  }, [product])

  const variant = getProductVariant(product, selectedOptions)
  const addToCart = async () => {
    setLoading(true)
    try {
      await addItem({
        productId: String(product.id),
        variantId: String(variant ? variant.id : product.variants[0]?.id),
      })
      openSidebar()
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <div className={s.sidebar}>
      <h5 className={s.category}>Kategoria</h5>
      <ProductTag name={product.name} />
      <h4 className={s.subtitle}>
        Jelly dessert icing caramels biscuit tootsie.
      </h4>
      <Text
        className="pb-4 break-words w-full max-w-xl"
        html={product.descriptionHtml || product.description}
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
        <Button type="button" className={(s.button, 'my-5')}>
          Join now
        </Button>
      </div>
    </div>
  )
}

export default ProductSidebar
