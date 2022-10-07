import { Layout } from '@components/common'
import type { InferGetServerSidePropsType, InferGetStaticPropsType } from 'next'
import { useTranslation } from 'react-i18next'
import { CMS } from 'cms'
import { getCmsBlock } from '@lib/cms'

const CMS_ID = 'static_page__home'

// export async function getStaticProps() {
export async function getServerSideProps() {
  const cmsBlock = (await getCmsBlock(CMS_ID).catch(console.error)) ?? null

  return {
    props: { cmsBlock },
    // revalidate: 60 * 5,
  }
}

export default function Home({
  cmsBlock,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation()

  return <>{cmsBlock && <CMS blockId={CMS_ID}>{cmsBlock.components}</CMS>}</>
}

Home.Layout = Layout
