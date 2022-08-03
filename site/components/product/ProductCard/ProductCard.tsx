import { FC } from 'react'
import cn from 'clsx'
import Link from 'next/link'
import s from './ProductCard.module.css'
import Image, { ImageProps } from 'next/image'
import ProductTag from '../ProductTag'
import { Product } from '@lib/products'
import { ProductBadge } from '../ProductBadge/ProductBadge'

interface Props {
  className?: string
  product: Product
  imgProps?: Omit<ImageProps, 'src' | 'layout' | 'placeholder' | 'blurDataURL'>
  variant?: 'default' | 'slim' | 'simple'
}

const placeholderImg = '/product-img-placeholder.svg'

const ProductCard: FC<Props> = ({
  product,
  imgProps,
  className,
  variant = 'default',
}) => {
  const rootClassName = cn(
    s.root,
    { [s.slim]: variant === 'slim', [s.simple]: variant === 'simple' },
    className
  )

  return (
    <Link href={`/products/${product.slug}`}>
      <a className={rootClassName} aria-label={product.title_1}>
        {variant === 'simple' && (
          <div className={s.cardContainer}>
            <div className={s.imageContainer}>
              <ProductBadge product={product} />
              <Image
                alt={product.title_1 || 'Product Image'}
                className={s.productImage}
                src={product.image?.src || placeholderImg}
                height={195}
                width={300}
                quality="85"
                layout="responsive"
                {...imgProps}
              />
            </div>
            <div className={s.textContainer}>
              <ProductTag className="text-left" fontSize={20}>
                {product.title_1}
              </ProductTag>
              <span className={s.subtitle}>{product.title_2}</span>
            </div>
          </div>
        )}

        {variant === 'default' && (
          <div className={s.cardContainer}>
            <div className={s.imageContainer}>
              <ProductBadge product={product} />
              <Image
                alt={product.title_1 || 'Product Image'}
                className={s.productImage}
                src={product.image?.src || placeholderImg}
                height={195}
                width={300}
                quality="85"
                layout="responsive"
                {...imgProps}
              />
            </div>
            <div className={s.textContainer}>
              <ProductTag className="text-left">{product.title_1}</ProductTag>

              <span className={s.subtitle}>{product.title_2}</span>
            </div>
          </div>
        )}
      </a>
    </Link>
  )
}

export default ProductCard
