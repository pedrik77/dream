import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'
import { Product } from '@lib/api/shop/products'
import { shop } from '@lib/api'

interface ProductDetailProps {
  product: Product
}
export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter()

  return router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <ProductView product={product} />
  )
}

ProductDetail.Layout = Layout

export const getServerSideProps: GetServerSideProps<
  ProductDetailProps
> = async ({ params }) => {
  const product = await shop.products
    .get((params?.slug as string) || '')
    .catch(console.error)

  if (!product) return { notFound: true }

  return { props: { product } }
}
