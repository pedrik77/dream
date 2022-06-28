import { FC } from 'react'
import cn from 'clsx'
import Link from 'next/link'
import s from './ProductCard.module.css'
import Image, { ImageProps } from 'next/image'
import WishlistButton from '@components/wishlist/WishlistButton'
import usePrice from '@framework/product/use-price'
import ProductTag from '../ProductTag'
import { Product } from '@lib/products'

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
    <Link href={`/product/${product.slug}`}>
      <a className={rootClassName} aria-label={product.title_1}>
        {variant === 'slim' && (
          <>
            <div className={s.header}>
              <span>{product.title_1}</span>
            </div>
            {product && false && (
              <div>
                <Image
                  quality="85"
                  src={product.gallery?.[0].src || placeholderImg}
                  alt={product.title_1 || 'Product Image'}
                  height={320}
                  width={320}
                  layout="fixed"
                  {...imgProps}
                />
              </div>
            )}
          </>
        )}

        {variant === 'simple' && (
          <>
            <div className={s.imageContainer}>
              {product && false && (
                <div>
                  <Image
                    alt={product.title_1 || 'Product Image'}
                    className={s.productImage}
                    src={product.gallery?.[0].src || placeholderImg}
                    height={540}
                    width={540}
                    quality="85"
                    layout="responsive"
                    {...imgProps}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {variant === 'default' && (
          <>
            <ProductTag name={product.title_1} />
            <div className={s.imageContainer}>
              {product && false && (
                <div>
                  <Image
                    alt={product.title_1 || 'Product Image'}
                    className={s.productImage}
                    src={product.gallery?.[0].src || placeholderImg}
                    height={540}
                    width={540}
                    quality="85"
                    layout="responsive"
                    {...imgProps}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </a>
    </Link>
  )
}

export default ProductCard
