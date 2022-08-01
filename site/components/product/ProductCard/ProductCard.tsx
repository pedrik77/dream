import { FC } from 'react'
import cn from 'clsx'
import Link from 'next/link'
import s from './ProductCard.module.css'
import Image, { ImageProps } from 'next/image'
import WishlistButton from '@components/wishlist/WishlistButton'
import usePrice from '@framework/product/use-price'
import ProductTag from '../ProductTag'
import { Product } from '@lib/products'
import { Text } from '@components/ui'

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
            {product && (
              <div className={s.imageContainer}>
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
            )}
            <div className={s.textContainer}>
              <ProductTag className="text-left">{product.title_1}</ProductTag>
              <span className="text-base m-0 text-left">{product.title_2}</span>
            </div>
          </div>
        )}

        {variant === 'default' && (
          <div className={s.cardContainer}>
            {product && (
              <div className={s.imageContainer}>
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
            )}
            <div className={s.textContainer}>
              <ProductTag className="text-left">{product.title_1}</ProductTag>

              <span className="text-base m-0 text-left">{product.title_2}</span>
            </div>
          </div>
        )}
      </a>
    </Link>
  )
}

export default ProductCard
