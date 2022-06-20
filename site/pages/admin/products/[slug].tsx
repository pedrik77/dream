import { getProduct } from '@lib/products'
import { GetServerSideProps } from 'next'
import React from 'react'

export default function ProductForm({ product }) {
  return <div></div>
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (params && params.slug != 'add') {
    getProduct(params.slug as string)
  }

  return {
    props: {},
  }
}
