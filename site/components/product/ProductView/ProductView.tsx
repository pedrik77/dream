import cn from 'clsx'
import Image from 'next/image'
import s from './ProductView.module.css'
import { FC, useRef } from 'react'
import usePrice from '@framework/product/use-price'
import { WishlistButton } from '@components/wishlist'
import { ProductSlider, ProductCard } from '@components/product'
import { Button, Container, Text } from '@components/ui'
import { SEO } from '@components/common'
import ProductSidebar from '../ProductSidebar'
import ProductTag from '../ProductTag'
import { Product } from '@lib/products'
interface ProductViewProps {
  product: Product
  relatedProducts: Product[]
}

const images = [
  // TODO
  {
    url: '/assets/tesla.jpg',
    altText: 'Lightweight Jacket',
    width: 1000,
    height: 1000,
  },
  {
    url: '/assets/tesla1.jpg',
    altText: 'Lightweight Jacket',
    width: 1000,
    height: 1000,
  },
  {
    url: '/assets/tesla3.jpg',
    altText: 'Lightweight Jacket',
    width: 1000,
    height: 1000,
  },
]

const ProductView: FC<ProductViewProps> = ({ product, relatedProducts }) => {
  const buyCardsRef = useRef<HTMLElement>(null)

  return (
    <>
      <Container className="max-w-none w-full" clean>
        <div className={cn(s.root, 'fit')}>
          <div className={cn(s.main, 'fit')}>
            <div className={s.sliderContainer}>
              <ProductSlider key={product.slug}>
                {images.map((image, i) => (
                  <div key={image.url} className={s.imageContainer}>
                    <Image
                      className={s.img}
                      src={image.url!}
                      alt={image.altText || 'Product Image'}
                      layout="responsive"
                      width={800}
                      height={600}
                      priority={i === 0}
                      quality="100"
                    />
                  </div>
                ))}
              </ProductSlider>
            </div>
          </div>

          <ProductSidebar
            product={product}
            onJoinNow={() => {
              if (!buyCardsRef.current) return

              // TODO: BETTER SCROLL
              buyCardsRef.current.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        </div>
        <hr className="mt-7 border-accent-2" />

        {/* TODO: ADD WYSIYG EDITOR */}

        <section className={s.buySection} ref={buyCardsRef}>
          <h2 className={s.sectionHeading}>BUY NOW TICKETS</h2>
          <div className={s.buyCards}>
            {[20, 30, 50].map((price) => (
              <div key={price} className={s.buyCard}>
                <h5 className={s.ticketsNo}>{price / 2}</h5>
                <span className={s.tickets}>Tiketov</span>
                <Button className={s.btn}>{price} €</Button>
              </div>
            ))}
          </div>
        </section>
        <section className="py-12 px-6 mb-10">
          <Text variant="sectionHeading">Related Products</Text>
          <div className={s.relatedProductsGrid}>
            {relatedProducts.map((p) => (
              <div
                key={p.slug}
                className="animated fadeIn bg-accent-0 border border-accent-2"
              >
                <ProductCard
                  product={p}
                  key={p.slug}
                  variant="simple"
                  className="animated fadeIn"
                  imgProps={{
                    width: 300,
                    height: 300,
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      </Container>
      <SEO
        title={product.title_1}
        description={product.short_desc}
        openGraph={{
          type: 'website',
          title: product.title_1,
          description: product.short_desc,
          images: [
            {
              url: images[0]?.url!, // TODO
              width: '800',
              height: '600',
              alt: product.title_1,
            },
          ],
        }}
      />
    </>
  )
}

export default ProductView
