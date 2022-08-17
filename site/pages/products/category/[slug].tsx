import { CategoryView, FALLBACK_BANNER } from '@components/product/CategoryView'
import { getAllSlugs, getCategory } from '@lib/categories'
import { GetStaticPaths, GetStaticProps } from 'next'

export default CategoryView

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categorySlug = params?.slug || null

  const category =
    typeof categorySlug === 'string'
      ? await getCategory(categorySlug)
      : undefined

  if (!category) return { notFound: true }

  const banner = category?.banner || FALLBACK_BANNER

  const props = { categorySlug, banner }

  return {
    props,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = (await getAllSlugs()).map((slug) => ({
    params: { slug },
  }))

  return {
    paths,
    fallback: false,
  }
}
