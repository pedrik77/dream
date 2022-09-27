import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { Layout } from '@components/common'
import { useRouter } from 'next/router'
import { getPage, getPageCmsId, getPages, Page, pageHref } from '@lib/pages'
import { CMS } from 'cms'

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ slug: string }>) {
  const page = await getPage(params?.slug as string)

  if (!page) {
    return {
      notFound: true,
    }
  }

  return {
    props: { page },
    revalidate: 60 * 60, // Every hour
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const pages = await getPages()
  const paths = pages.map((page) => pageHref(page.slug))

  return {
    paths,
    fallback: 'blocking',
  }
}

export default function Pages({ page }: { page: Page }) {
  const router = useRouter()

  return router.isFallback ? (
    <h1>Loading...</h1> // TODO (BC) Add Skeleton Views
  ) : (
    <CMS blockId={getPageCmsId(page.slug)}>{page.cmsBlock?.components}</CMS>
  )
}

Pages.Layout = Layout
