import { CategoryView, FALLBACK_BANNER } from '@components/product/CategoryView'
import { GetServerSideProps, GetStaticProps } from 'next'

export default CategoryView

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    banner: FALLBACK_BANNER,
  },
})
