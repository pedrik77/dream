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
import { Post } from '@lib/api/blog/posts'
import { blog } from '@lib/api'

// export async function getStaticProps({ params, }: GetStaticPropsContext<{ slug: string }>) {
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const page = await getPage(params?.slug as string).catch(console.error)

  if (!!page) {
    return {
      props: { pageOrPost: page, isPage: true },
      // revalidate: 60 * 5,
    }
  }

  const post = await blog.posts
    .getPost(params?.slug as string)
    .catch(console.error)

  if (!!post) {
    return {
      props: { pageOrPost: post, isPage: false },
    }
  }

  return {
    notFound: true,
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

export default function Pages({
  pageOrPost,
  isPage = true,
}: {
  pageOrPost: Page | Post
  isPage?: boolean
}) {
  const router = useRouter()

  return router.isFallback ? (
    <h1>Loading...</h1> // TODO (BC) Add Skeleton Views
  ) : (
    <>
      {isPage ? (
        <CMS
          blockId={getPageCmsId(pageOrPost.slug)}
          allowedComponents={[
            CMS.ContaineredWysiwyg,
            CMS.PageBanner,
            CMS.ContactForm,
            CMS.Spacer,
          ]}
        >
          {/* @ts-ignore */}
          {pageOrPost.cmsBlock?.components}
        </CMS>
      ) : (
        <>{pageOrPost.title}</>
      )}

      <SEO
        title={pageOrPost.meta_title || pageOrPost.title}
        description={pageOrPost.meta_description}
        robots={pageOrPost.meta_robots}
        openGraph={{
          type: 'website',
          title:
            pageOrPost.og_title || pageOrPost.meta_title || pageOrPost.title,
          description: pageOrPost.og_description || pageOrPost.meta_description,
          images: [
            {
              url: pageOrPost.og_image_url,
              width: pageOrPost.og_image_width,
              height: pageOrPost.og_image_height,
              alt: pageOrPost.og_image_alt,
            },
          ],
        }}
      />
    </>
  )
}

Pages.Layout = Layout
