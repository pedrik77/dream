import { useEffect, useState } from 'react'
import { Container, Text } from '@components/ui'
import { Tab } from '@components/ui/Tab/Tab'
import ProductCard from './ProductCard'
import { Layout, SEO } from '@components/common'
import { Skeleton } from '@mui/material'
import { CMS } from 'cms'
import { getCategoryCmsId, useCategory } from '@lib/api/shop/categories'
import { useRouter } from 'next/router'
import { shop } from '@lib/api'

const { useSubscription } = shop.products

export const FALLBACK_BANNER = '/assets/category_fallback_banner.jpg'

interface CategoryViewProps {
  categorySlug?: string
}

const Skeletons = Array(3)
  .fill(null)
  .map((_, i) => (
    <Skeleton
      key={i}
      sx={{ backgroundColor: 'var(--primary)' }}
      height={250}
      animation="pulse"
    />
  ))

export function CategoryView({ categorySlug }: CategoryViewProps) {
  const [showClosed, setShowClosed] = useState(false)
  const [bannerUrl, setBannerUrl] = useState('')

  const { locale = '', events } = useRouter()

  const category = useCategory({ slug: categorySlug || '' })
  const {
    data: products,
    loading,
    refresh,
  } = useSubscription({
    categorySlug,
    showClosed,
  })

  useEffect(() => {
    const handle = () => refresh()

    events.on('routeChangeComplete', handle)

    return () => events.off('routeChangeComplete', handle)
  }, [events, refresh])

  const title = category?.title || 'Všetky produkty'
  const description = category?.description || ''

  return (
    <Container clean>
      <CMS
        key={getCategoryCmsId(categorySlug)}
        blockId={getCategoryCmsId(categorySlug)}
        single={CMS.PageBanner}
        onData={([bannerComponent]) =>
          setBannerUrl(bannerComponent?.values?.[locale].img || '')
        }
      />
      <Container className="flex gap-8 items-center justify-center my-10">
        <Tab
          active={!showClosed}
          onClick={() => {
            setShowClosed(false)
            refresh()
          }}
        >
          Aktuálne
        </Tab>
        <Tab
          active={showClosed}
          onClick={() => {
            setShowClosed(true)
            refresh()
          }}
        >
          Predošlé
        </Tab>
      </Container>
      <Container className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 jitems-center ustify-center text-center mt-8 mb-16 max-w-6xl">
        {loading ? (
          Skeletons
        ) : !products.length ? (
          <Text variant="sectionHeading" className="col-span-full my-8">
            Žiadne produkty v kategórii :(
          </Text>
        ) : (
          products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))
        )}
      </Container>

      <SEO
        title={title}
        description={description}
        openGraph={{
          type: 'website',
          title,
          description,
          images: [
            {
              url: bannerUrl,
              width: '2000',
              height: '610',
              alt: title + ' banner',
            },
          ],
        }}
      />
    </Container>
  )
}

CategoryView.Layout = Layout
