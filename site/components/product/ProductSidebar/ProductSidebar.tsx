import s from './ProductSidebar.module.css'
import { useAddItem } from '@framework/cart'
import { FC, useEffect, useMemo, useState } from 'react'
import { ProductOptions } from '@components/product'
import { Button, Text, Rating, Collapse, useUI } from '@components/ui'
import {
  getProductVariant,
  selectDefaultOptionFromProduct,
  SelectedOptions,
} from '../helpers'
import ProductTag from '../ProductTag'
import Link from 'next/link'
import { getDonorsCount, Product } from '@lib/products'
import { basicShowFormat } from '@lib/date'
import { Category, getCategory } from '@lib/categories'
import CountUp from 'react-countup'
import { handleErrorFlash } from '@components/ui/FlashMessage'

interface ProductSidebarProps {
  product: Product
  onJoinNow?: () => void
}

const ProductSidebar: FC<ProductSidebarProps> = ({
  product,
  onJoinNow = () => {},
}) => {
  const [category, setCategory] = useState<Category | null>(null)
  const [countUpValue, setCountUpValue] = useState(0)

  useEffect(() => {
    if (product.category) {
      getCategory(product.category).then(setCategory)
    }
  }, [product.category])

  useEffect(() => {
    if (!product.show_donors) return setCountUpValue(product.price ?? 0)

    getDonorsCount(product.slug).then(setCountUpValue).catch(handleErrorFlash)
  }, [product])

  return (
    <div className={s.root}>
      {category && (
        <Link href={`/category/${category.slug}`}>
          <a>
            <h5 className={s.category}>{category.title}</h5>
          </a>
        </Link>
      )}
      <ProductTag>{product.title_1}</ProductTag>
      <h4 className={s.subtitle}>{product.title_2}</h4>
      <h4>
        <CountUp end={countUpValue} duration={1.25} />{' '}
        {product.show_donors ? ' donorov' : ' €'}
      </h4>
      <Text
        className="pb-4 break-words w-full max-w-xl"
        html={product.short_desc}
      />
      <div className={s.info}>
        <div>
          <span className={s.infoTitle}>Closes</span>
          <span>{basicShowFormat(product.closing_date)}</span>
        </div>
        <div>
          <span className={s.infoTitle}>Winner Announcement</span>
          <span>{basicShowFormat(product.winner_announce_date)}</span>
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
