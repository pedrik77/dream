import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Container, Text } from '@components/ui'
import PageBanner from '@components/ui/PageBanner'
import { useProducts } from '@lib/products'
import { GetServerSideProps } from 'next'
import React from 'react'

interface ProductsPageProps {
  category?: string
}

export default function Products({ category = '' }: ProductsPageProps) {
  const products = useProducts(category)

  return (
    <Container clean>
      <PageBanner
        primaryTitle="Dessert dragée"
        secondaryTitle="Cupcake ipsum"
        img="/assets/tesla1_1440x810.jpg"
      />
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 justify-center text-center my-8 max-w-6xl">
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
