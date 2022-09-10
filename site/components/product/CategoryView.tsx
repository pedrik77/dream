import { useProducts } from '@lib/products'
import { useState } from 'react'
import { Container, Text } from '@components/ui'
import PageBanner from '@components/ui/PageBanner'
import { Tab } from '@components/ui/Tab/Tab'
import ProductCard from './ProductCard'
import { Layout } from '@components/common'
import { Skeleton } from '@mui/material'
import { CMS } from 'cms'
import { getCategoryCmsId } from '@lib/categories'

export const FALLBACK_BANNER = '/assets/category_fallback_banner.jpg'

interface CategoryViewProps {
  banner: string
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

export function CategoryView({ banner, categorySlug }: CategoryViewProps) {
  const [showClosed, setShowClosed] = useState(false)

  const { products, loading } = useProducts({ categorySlug, showClosed })

  return (
    <Container clean>
      <CMS
        key={getCategoryCmsId(categorySlug)}
        blockId={getCategoryCmsId(categorySlug)}
        maxNumberOfComponents={1}
        allowedComponents={['page_banner']}
      />
      <Container className="flex gap-8 items-center justify-center my-10">
        <Tab active={!showClosed} onClick={() => setShowClosed(false)}>
          Aktuálne
        </Tab>
        <Tab active={showClosed} onClick={() => setShowClosed(true)}>
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
    </Container>
  )
}

CategoryView.Layout = Layout
