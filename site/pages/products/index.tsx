import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Button, Container, Text } from '@components/ui'
import { handleErrorFlash } from '@components/ui/FlashMessage'
import PageBanner from '@components/ui/PageBanner'
import { Tab } from '@components/ui/Tab/Tab'
import { useCategory } from '@lib/categories'
import { useProducts } from '@lib/products'
import { GetServerSideProps } from 'next'
import React from 'react'

interface ProductsPageProps {
  categorySlug?: string
}

export default function Products({ categorySlug = '' }: ProductsPageProps) {
  const [showClosed, setShowClosed] = React.useState(false)

  const products = useProducts({ categorySlug, showClosed })
  const category = useCategory({
    slug: categorySlug,
    onError: handleErrorFlash,
  })

  return (
    <Container clean>
      <PageBanner img="/assets/page_banner.jpg" />
      <Container className="flex gap-8 items-center justify-center my-10">
        <Tab active={!showClosed} onClick={() => setShowClosed(false)}>
          Aktuálne
        </Tab>
        <Tab active={showClosed} onClick={() => setShowClosed(true)}>
          Predošlé
        </Tab>
      </Container>
      <Container className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 jitems-center ustify-center text-center mt-8 mb-16 max-w-6xl">
        {!products.length && (
          <Text variant="sectionHeading" className="col-span-full my-8">
            Žiadne produkty v kategórii :(
          </Text>
        )}
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </Container>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: { categorySlug: query.category || '' },
})

Products.Layout = Layout
