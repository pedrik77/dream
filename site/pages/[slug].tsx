import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Text } from '@components/ui'
import { Layout } from '@components/common'
import getSlug from '@lib/get-slug'
import { missingLocaleInPages } from '@lib/usage-warns'
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
    <CMS blockId={getPageCmsId(page.slug)} allowedComponents={[]} />
  )
}

Pages.Layout = Layout
