import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  GetServerSideProps,
} from 'next'
import { Layout, SEO } from '@components/common'
import { useRouter } from 'next/router'
import {
  getPage,
  getPageCmsId,
  getPages,
  Page,
  pageHref,
} from '@lib/api/cms/pages'
import { CMS } from 'cms'
import { Container } from '@components/ui'

// export async function getStaticProps({ params, }: GetStaticPropsContext<{ slug: string }>) {
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const page = await getPage(params?.slug as string).catch(console.error)

  if (!page) {
    return {
      notFound: true,
    }
  }

  return {
    props: { page },
    // revalidate: 60 * 5,
  }
}

// export async function getStaticPaths({ locales }: GetStaticPathsContext) {
//   const pages = await getPages()
//   const paths = pages.map((page) => pageHref(page.slug))

//   return {
//     paths,
//     fallback: 'blocking',
//   }
// }

export default function Pages({ page }: { page: Page }) {
  const router = useRouter()

  return router.isFallback ? (
    <h1>Loading...</h1> // TODO (BC) Add Skeleton Views
  ) : (
    <>
      <CMS
        blockId={getPageCmsId(page.slug)}
        allowedComponents={[
          CMS.ContaineredWysiwyg,
          CMS.PageBanner,
          CMS.ContactForm,
          CMS.Spacer,
        ]}
      >
        {page.cmsBlock?.components}
      </CMS>

      <SEO
        title={page.meta_title || page.title}
        description={page.meta_description}
        robots={page.meta_robots}
        openGraph={{
          type: 'website',
          title: page.og_title || page.meta_title || page.title,
          description: page.og_description || page.meta_description,
          images: [
            {
              url: page.og_image_url,
              width: page.og_image_width,
              height: page.og_image_height,
              alt: page.og_image_alt,
            },
          ],
        }}
      />
    </>
  )
}

Pages.Layout = Layout
