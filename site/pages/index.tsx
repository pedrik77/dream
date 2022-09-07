import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Hero } from '@components/ui'
// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Banner from '@components/ui/Banner'
import Carousel from '@components/ui/Carousel'
import LogosSection from '@components/ui/LogosSection'
import { useTranslation } from 'react-i18next'
import { Components } from '@components/cms/Components'
import { getCmsBlock } from '@lib/components'

const CMS_ID = 'static_page__home'

export async function getStaticProps() {
  const cmsBlock = (await getCmsBlock(CMS_ID).catch(console.error)) ?? null

  return {
    props: { cmsBlock },
    revalidate: 60,
  }
}

export default function Home({
  cmsBlock,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation()

  return (
    <>
      {/* TO DO EDIT PICS, TEXT, BUTTON link*/}
      {cmsBlock && (
        <Components blockId={CMS_ID}>
          {cmsBlock.components.sort((a, b) => a.order - b.order)}
        </Components>
      )}

      <Carousel />

      <LogosSection />
    </>
  )
}

Home.Layout = Layout
