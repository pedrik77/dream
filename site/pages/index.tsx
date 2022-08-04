import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Hero } from '@components/ui'
// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Banner from '@components/ui/Banner'
import Carousel from '@components/ui/Carousel'
import LogosSection from '@components/ui/LogosSection'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  const productButtonText = t('homepage.product.button')

  return (
    <>
      {/* TO DO EDIT PICS, TEXT, BUTTON link*/}
      <Banner
        primaryTitle="vysnivaj.si"
        secondaryTitle="Tadžikistan"
        subtitle="Vysnívaj si magický pobyt v tadžických horách."
        img="/assets/mountains_1440x910.jpg"
        button={{
          text: productButtonText,
          link: '/products/magicky-pobyt-v-tadzickych-horach',
        }}
      />
      <Banner
        primaryTitle="vysnivaj.si"
        secondaryTitle="Nora Nora"
        subtitle="Vysnívaj si luxusnú dovolenku na ostrove Nora Nora."
        img="/assets/beach_1440x910.jpg"
        button={{
          text: productButtonText,
          link: '/products/dovolenka-na-ostrove-nora-nora',
        }}
      />
      <Banner
        primaryTitle="vysnivaj.si"
        secondaryTitle="Traktar 4000"
        subtitle="Vyhrajte jedinečný Traktar 4000"
        img="/assets/truck_1440x910.jpg"
        button={{ text: productButtonText, link: '/products/traktar-4000' }}
      />
      <Hero
        headline={t('homepage.infobox.title')}
        description={t('homepage.infobox.text')}
      />

      <Carousel />

      <LogosSection />
    </>
  )
}

Home.Layout = Layout
