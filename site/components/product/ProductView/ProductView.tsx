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
import { setOrder } from '@lib/orders'
import { v4 as uuid4 } from 'uuid'
import { useUser } from '@lib/auth'
import { Timestamp } from 'firebase/firestore'
import { today } from '@lib/date'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { useRouter } from 'next/router'
interface ProductViewProps {
  product: Product
}

const GLOBAL_ENTRIES = Object.entries({ 1: 1, 4: 2, 15: 5, 50: 10 })

const ProductView: FC<ProductViewProps> = ({ product }) => {
  const buyCardsRef = useRef<HTMLElement>(null)
  const { user } = useUser()
  const router = useRouter()

  const relatedProducts: Product[] = []

  const handleBuy = (ticketCount: number, price: number) => {
    setOrder({
      uuid: uuid4(),
      user_id: user?.uid,
      product_slug: product.slug,
      ticket_count: ticketCount,
      total_price: price,
      created_date: Timestamp.fromDate(new Date(today())),
    })
      .then(() => {
        flash('Ďakujeme za nákup!', 'success')
        router.push('/orders')
      })
      .catch(handleErrorFlash)
  }

  return (
    <>
      <Container className="max-w-none w-full" clean>
        <div className={cn(s.root, 'fit')}>
          <div className={cn(s.main, 'fit')}>
            <div className={s.sliderContainer}>
              <ProductSlider key={product.slug}>
                {product.gallery.map((image, i) => (
                  <div key={image.path} className={s.imageContainer}>
                    <Image
                      className={s.img}
                      src={image.src}
                      alt={product.title_1}
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
        <div dangerouslySetInnerHTML={{ __html: product.long_desc }} />

        <section className={s.buySection} ref={buyCardsRef}>
          <h2 className={s.sectionHeading}>BUY NOW TICKETS</h2>
          <div className={s.buyCards}>
            {GLOBAL_ENTRIES.map(([ticketCount, price]) => (
              <div key={price} className={s.buyCard}>
                <h5 className={s.ticketsNo}>{ticketCount}</h5>
                <span className={s.tickets}>Tiketov</span>
                <Button
                  className={s.btn}
                  onClick={() => handleBuy(Number(ticketCount), price)}
                >
                  {price} €
                </Button>
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
              url: product.gallery[0]?.src, // TODO
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
