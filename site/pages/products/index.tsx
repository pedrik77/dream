import { Layout } from '@components/common'
import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import { Container } from '@components/ui'
import { useProducts } from '@lib/products'
import React from 'react'

export default function Products() {
  const products = useProducts()

  return <Container></Container>
}

Products.Layout = Layout
