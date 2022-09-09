import cn from 'clsx'
import Image from 'next/image'
import s from './ProductView.module.css'
import { FC, useRef } from 'react'
import { ProductSlider, ProductCard } from '@components/product'
import { Button, Container, Text } from '@components/ui'
import { SEO } from '@components/common'
import ProductSidebar from '../ProductSidebar'
import { getProductCmsId, Product, useProducts } from '@lib/products'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { useRouter } from 'next/router'
import { useShopContext } from '@lib/shop'
import { confirm } from '@lib/alerts'
import { useTranslation } from 'react-i18next'
import { Components } from '@lib/cms'

interface ProductViewProps {
  product: Product
}

const GLOBAL_ENTRIES = Object.entries({
  1: 1,
  4: 2,
  15: 5,
  50: 10,
})

const ProductView: FC<ProductViewProps> = ({ product }) => {
  const scrollToRef = useRef<HTMLElement>(null)
  const router = useRouter()

  const { addToCart, isInCart } = useShopContext()
  const { t } = useTranslation()

  const { products } = useProducts({
    categorySlug: product.category,
  })

  const relatedProducts = products
    .filter(({ slug }) => slug !== product.slug)
    .slice(0, 3)

  const handleScroll = () => {
    if (!scrollToRef.current) return

    const element = scrollToRef.current
    const offset = 111
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }

  const handleAddToCart = async (ticketCount: number, price: number) => {
    if (
      isInCart(product.slug) &&
      !(await confirm('Produkt už máte zvolený. Prajete si zmeniť variantu?'))
    )
      return router.push('/cart')

    addToCart({
      product,
      ticketCount: ticketCount,
      price,
      forceOverride: true,
    })
      .then(() => {
        flash('V košíku!', 'success')
        router.push('/cart')
      })
      .catch(handleErrorFlash)
  }

  return (
    <>
      <Container className="max-w-none w-full" clean>
        <div className={cn(s.root, 'fit')}>
          <div className={cn(s.main, 'fit')}>
            <div className={s.sliderContainer}>
              {!!product.gallery.length && (
                <ProductSlider
                  key={product.slug}
                  single={product.gallery.length === 1}
                >
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
              )}
            </div>
          </div>

          <ProductSidebar product={product} onJoinNow={handleScroll} />

          <div className={s.descContainer}>
            <Text variant="pageHeading">Toto dostaneš</Text>
            {product.cmsBlock && (
              <Components
                blockId={getProductCmsId(product.slug)}
                allowedComponents={[]}
                forbiddenComponents={[]}
              >
                {product.cmsBlock.components}
              </Components>
            )}
          </div>
        </div>

        <section className={s.buySection} ref={scrollToRef}>
          <Text variant="myHeading" className="text-center">
            {t('product.entry.join')}
          </Text>
          <div className={s.buyCards}>
            {GLOBAL_ENTRIES.map(([ticketCount, price]) => (
              <div key={price} className={s.buyCard}>
                <h5 className={s.ticketsNo}>{ticketCount}</h5>
                <span className={s.tickets}>Tiketov</span>
                <Button
                  className={s.btn}
                  onClick={() => handleAddToCart(Number(ticketCount), price)}
                >
                  {t('product.entry.donate')} {price} €
                </Button>
              </div>
            ))}
          </div>
        </section>
        {!!relatedProducts.length && (
          <section className="py-12 px-6 mb-10 text-center">
            <Text variant="myHeading">{t('product.related')}</Text>
            <div className={s.relatedProductsGrid}>
              {relatedProducts.map((p) => (
                <div key={p.slug} className="animated fadeIn bg-accent-0">
                  <ProductCard
                    product={p}
                    key={p.slug}
                    variant="simple"
                    className="animated fadeIn"
                    imgProps={{
                      width: 500,
                      height: 300,
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
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
              url: product.image?.src, // TODO
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
