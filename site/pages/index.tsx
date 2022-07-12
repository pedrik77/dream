import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Hero } from '@components/ui'
// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Banner from '@components/ui/Banner'
import Carousel from '@components/ui/Carousel'
import LogosSection from '@components/ui/LogosSection'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const productsPromise = commerce.getAllProducts({
    variables: { first: 6 },
    config,
    preview,
    // Saleor provider only
    ...({ featured: true } as any),
  })
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { products } = await productsPromise
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  return {
    props: {
      products,
      categories,
      brands,
      pages,
    },
    revalidate: 60,
  }
}

export default function Home({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      {/* TO DO EDIT PICS, TEXT, BUTTON */}
      <Banner
        primaryTitle="Dessert dragée"
        secondaryTitle="Cupcake ipsum"
        subtitle=" Soufflé bonbon caramels jelly beans. "
        img="/assets/tesla1_1440x810.jpg"
        buttonText="Join Now"
      />
      <Banner
        primaryTitle="Dessert dragée"
        secondaryTitle="Cupcake ipsum"
        subtitle=" Soufflé bonbon caramels jelly beans. "
        img="/assets/tesla1_1440x810.jpg"
        buttonText="Join Now"
      />
      <Banner
        primaryTitle="Dessert dragée"
        secondaryTitle="Cupcake ipsum"
        subtitle=" Soufflé bonbon caramels jelly beans. "
        img="/assets/tesla1_1440x810.jpg"
        buttonText="Join Now"
      />
      <Hero
        headline=" Dessert dragée"
        description="Cupcake ipsum dolor sit amet lemon drops pastry cotton candy. Sweet carrot cake macaroon bonbon croissant fruitcake jujubes macaroon oat cake. Soufflé bonbon caramels jelly beans. Tiramisu sweet roll cheesecake pie carrot cake. Tiramisu sweet roll cheesecake pie carrot cake. Cupcake ipsum dolor sit amet lemon drops pastry cotton candy. Sweet carrot cake macaroon bonbon croissant fruitcake jujubes macaroon oat cake. "
      />

      <Carousel />

      <LogosSection />
    </>
  )
}

Home.Layout = Layout
