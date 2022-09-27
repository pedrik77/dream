import s from './ProductSidebar.module.css'
import { FC, useEffect, useState } from 'react'
import { Button, Text } from '@components/ui'
import ProductTag from '../ProductTag'
import Link from 'next/link'
import { getDonorsCount, Product } from '@lib/products'
import { basicShowFormat } from '@lib/date'
import { Category, categoryHref, getCategory } from '@lib/categories'
import CountUp from 'react-countup'
import { handleErrorFlash } from '@components/ui/FlashMessage'
import { useTranslation } from 'react-i18next'
import { noop } from '@lib/common'

interface ProductSidebarProps {
  product: Product
  onJoinNow?: () => void
}

const ProductSidebar: FC<ProductSidebarProps> = ({
  product,
  onJoinNow = noop,
}) => {
  const { t } = useTranslation()

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
        <Link href={categoryHref(category.slug)}>
          <a>
            <h5 className={s.category}>{category.title}</h5>
          </a>
        </Link>
      )}
      <ProductTag>{product.title_1}</ProductTag>
      <h4 className={s.subtitle}>A podporte {product.title_2}</h4>
      <h4 className={s.countUp}>
        {product.show_donors ? ' Prispelo už ' : 'Výhra v hodnote '}
        <CountUp end={countUpValue} duration={1.25} separator=" " />{' '}
        {product.show_donors ? ' donorov' : ' €'}
      </h4>
      <Text
        className="pb-4 break-words w-full max-w-xl"
        html={product.short_desc}
      />
      <div className={s.info}>
        <div>
          <span className={s.infoTitle}>{t('product.closing')}</span>
          <span>{basicShowFormat(product.closing_date)}</span>
        </div>
        <div>
          <span className={s.infoTitle}>{t('product.winnerAnnounce')}</span>
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
          {t('product.joinNow')}
        </Button>
      </div>
    </div>
  )
}

export default ProductSidebar