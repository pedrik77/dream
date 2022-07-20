import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Button, Container, Text } from '@components/ui'
import PageBanner from '@components/ui/PageBanner'
import { Tab } from '@components/ui/Tab/Tab'
import { useProducts } from '@lib/products'
import { GetServerSideProps } from 'next'
import React from 'react'

interface ProductsPageProps {
  category?: string
}

export default function Products({ category = '' }: ProductsPageProps) {
  const products = useProducts({ category })

  return (
    <Container clean>
      <PageBanner img="/assets/page_banner.jpg" />
      <Container className="flex gap-8 items-center justify-center my-16">
        <Tab active>Aktuálne</Tab>
        <Tab>Predošlé</Tab>
      </Container>
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 jitems-center ustify-center text-center mt-8 mb-16 max-w-6xl">
        {!products.length && (
          <Text variant="sectionHeading" className="my-4">
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
  props: { category: query.category || '' },
})

Products.Layout = Layout
