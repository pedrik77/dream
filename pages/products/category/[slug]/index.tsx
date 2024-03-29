import { CategoryView } from '@components/product/CategoryView'
import { getCategory } from '@lib/api/shop/categories'
import { GetServerSideProps } from 'next'

export default CategoryView

// export const getStaticProps: GetStaticProps = async ({ params }) => {
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const categorySlug = params?.slug || null

  const category =
    typeof categorySlug === 'string'
      ? await getCategory(categorySlug)
      : undefined

  if (!category) return { notFound: true }

  return {
    props: { categorySlug },
    // revalidate: 60 * 5,
  }
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const paths = (await getAllSlugs()).map((slug) => ({
//     params: { slug },
//   }))

//   return {
//     paths,
//     fallback: false,
//   }
// }
