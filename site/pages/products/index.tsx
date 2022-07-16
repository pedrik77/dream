import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Container } from '@components/ui'
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
    <Container>
      {!products.length && 'Žiadne produkty v kategórii'}
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
