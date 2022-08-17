import type { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'
import { getProduct, Product } from '@lib/products'

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
  const product = await getProduct((params?.slug as string) || '').catch(
    console.error
  )

  if (!product) return { notFound: true }

  return { props: { product } }
}
