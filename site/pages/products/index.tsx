import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Container, Text } from '@components/ui'
import { useProducts } from '@lib/products'
import { GetServerSideProps } from 'next'
import React from 'react'

interface ProductsPageProps {
  category?: string
}

export default function Products({ category = '' }: ProductsPageProps) {
  const products = useProducts(category)

  return (
    <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center text-center my-8">
      {!products.length && (
        <Text variant="sectionHeading" className="my-4">
          Žiadne produkty v kategórii :(
        </Text>
      )}
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: { category: query.category || '' },
})

Products.Layout = Layout
