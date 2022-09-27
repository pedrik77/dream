import { Layout } from '@components/common'
import type { InferGetStaticPropsType } from 'next'
import { useTranslation } from 'react-i18next'
import { CMS } from 'cms'
import { getCmsBlock } from '@lib/cms'

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

  return <>{cmsBlock && <CMS blockId={CMS_ID}>{cmsBlock.components}</CMS>}</>
}

Home.Layout = Layout
