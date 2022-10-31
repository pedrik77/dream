import cn from 'clsx'
import Image from 'next/image'
import s from './ProductView.module.css'
import { FC, useRef, useState } from 'react'
import { ProductSlider, ProductCard } from '@components/product'
import { Button, Container, Text } from '@components/ui'
import { SEO } from '@components/common'
import ProductSidebar from '../ProductSidebar'
import { Product } from '@lib/api/shop/products'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { useRouter } from 'next/router'
import { TICKETS_CMS_ID, useShopContext } from '@lib/api/shop/context'
import { confirm, prompt } from '@lib/api/page/alerts'
import { useTranslation } from 'react-i18next'
import { CMS } from 'cms'
import { shop } from '@lib/api'

const { useSubscription } = shop.products

interface ProductViewProps {
  product: Product
}

const GLOBAL_ENTRIES = [
  { count: 1, price: 1 },
  { count: 4, price: 2 },
  { count: 15, price: 5 },
  { count: 50, price: 10 },
]

const allowedComponents = [
  CMS.Wysiwyg,
  CMS.Image,
  CMS.PageBanner,
  CMS.Hero,
  CMS.Carousel,
  CMS.Text,
  CMS.Spacer,
]

const ProductView: FC<ProductViewProps> = ({ product }) => {
  const scrollToRef = useRef<HTMLElement>(null)
  const router = useRouter()

  const { addToCart, isInCart } = useShopContext()
  const { t } = useTranslation()

  const { data: products } = useSubscription({
    categorySlug: product.category,
  })

  const [tickets, setTickets] = useState(GLOBAL_ENTRIES)
  const [variableTicketCount, setVariableTicketCount] = useState(0)
  const [variableMin, setVariableMin] = useState(1)

  const productClosed = shop.products.isClosed(product)

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
        <CMS
          blockId={TICKETS_CMS_ID}
          single={CMS.Tickets}
          onData={([ticketComponent]) => {
            if (!ticketComponent) return

            const {
              tickets,
              variableTicketCount = 0,
              variableMin = 1,
            } = ticketComponent.value

            setTickets(tickets)

            setVariableMin(variableMin || 1)
            setVariableTicketCount(variableTicketCount || 0)
          }}
          preventRender
        />
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
            {!!product.winner_order ? (
              <CMS
                blockId={shop.products.getWinnerCmsId(product.slug)}
                allowedComponents={allowedComponents}
                forbiddenComponents={[]}
              />
            ) : (
              product.cmsBlock && (
                <CMS
                  blockId={shop.products.getProductCmsId(product.slug)}
                  allowedComponents={allowedComponents}
                  forbiddenComponents={[]}
                >
                  {product.cmsBlock.components}
                </CMS>
              )
            )}
          </div>
        </div>

        {!productClosed && (
          <section className={s.buySection} ref={scrollToRef}>
            <Text variant="myHeading" className="text-center">
              {t('product.entry.join')}
            </Text>
            <div className={s.buyCards}>
              {tickets.map(({ price, count }) => (
                <div key={price} className={s.buyCard}>
                  <h5 className={s.ticketsNo}>{count}</h5>
                  <span className={s.tickets}>Tiketov</span>
                  <Button
                    className={s.btn}
                    onClick={() => handleAddToCart(count, price)}
                  >
                    {t('product.entry.donate')} {price} €
                  </Button>
                </div>
              ))}
              {!!variableTicketCount && (
                <div className={s.buyCard}>
                  <h5 className={s.ticketsNo}>{variableTicketCount}</h5>
                  <span className={s.tickets}>Tiketov</span>
                  <Button
                    className={s.btn}
                    onClick={async () => {
                      const result = await prompt(t('product.entry.variable'), {
                        input: 'number',
                        inputValidator: (value) => {
                          if (Number(value) >= variableMin) return null

                          return `Minimálna hodnota je ${variableMin} €!`
                        },
                        inputValue: variableMin,
                        confirmButtonText: 'Prispieť',
                      })

                      result &&
                        handleAddToCart(variableTicketCount, Number(result))
                    }}
                  >
                    {t('product.entry.donate')}
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}
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
