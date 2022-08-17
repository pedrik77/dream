import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Text } from '@components/ui'
import Image from 'next/image'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const { pages } = await commerce.getAllPages({ config, preview })
  const { categories, brands } = await commerce.getSiteInfo({ config, preview })
  return {
    props: {
      pages,
      categories,
      brands,
    },
    revalidate: 200,
  }
}

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-8 sm:mx-auto py-20 flex flex-col items-center justify-center fit">
      <div className="w-4/5 h-2/5 display-block mb-4">
        <Image
          src="/404.png"
          alt="alt"
          width="500"
          height="300"
          layout="responsive"
          quality="100"
        />
      </div>
      <Text variant="heading">Ľutujeme...</Text>
      <Text className="text-lg">Tu si nič nevysnívate...</Text>
    </div>
  )
}

NotFound.Layout = Layout
