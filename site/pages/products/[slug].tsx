import type {
  GetServerSideProps,
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'
import { getProduct, Product } from '@lib/products'

interface SlugProps {
  product: Product
}
export default function Slug({ product }: SlugProps) {
  const router = useRouter()

  return router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <ProductView product={product} />
  )
}

Slug.Layout = Layout

export const getServerSideProps: GetServerSideProps<{
  product: Product
}> = async ({ params }) => {
  const product = await getProduct((params?.slug as string) || '')

  if (!product) return { notFound: true }

  return { props: { product } }
}
