import { Layout } from '@components/common'
// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { InferGetStaticPropsType } from 'next'
import LogosSection from '@components/ui/LogosSection'
import { useTranslation } from 'react-i18next'
import { CMS } from '@lib/cms'
import { getCmsBlock } from '@lib/cms/service'

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
      {cmsBlock && <CMS blockId={CMS_ID}>{cmsBlock.components}</CMS>}

      <LogosSection />
    </>
  )
}

Home.Layout = Layout
