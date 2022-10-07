import { CategoryView, FALLBACK_BANNER } from '@components/product/CategoryView'
import { GetServerSideProps, GetStaticProps } from 'next'

export default CategoryView

// export const getStaticProps: GetStaticProps = async () => ({
export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
    banner: FALLBACK_BANNER,
  },
  // revalidate: 60 * 5,
})
