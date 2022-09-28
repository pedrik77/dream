import { Layout } from '@components/common'
import { GetServerSideProps } from 'next'
import { Avatar } from '@components/common'
import { Container, Text } from '@components/ui'
import Link from 'next/link'
import React, { Fragment, useMemo } from 'react'
import { inputDateFormat } from '@lib/date'
import { Product, useProducts } from '@lib/products'
import { ProductCard } from '@components/product'
import Tree from '@components/winners/Tree'
import { CMS } from 'cms'
import { PageBanner } from 'cms/config'

const CMS_ID = 'static_page__winners'

// TODO - add multilang package
const MONTHS = [
  'január',
  'február',
  'marec',
  'apríl',
  'máj',
  'jún',
  'júl',
  'august',
  'september',
  'október',
  'november',
  'december',
]

interface WinnersPageProps {
  date?: string
}

export default function Winners({ date = '' }: WinnersPageProps) {
  const { products: allProducts } = useProducts({
    showClosed: true,
    orderBy: 'closing_date',
  })

  const currentMonth = date.split('-')[1]
  const currentYear = date.split('-')[0]

  const yearTree = useMemo(() => {
    const tree: {
      [index: string]: { [index: string]: Product[] }
    } = {}

    allProducts.forEach((product) => {
      const date = inputDateFormat(product.closing_date).split('-')
      const year = date[0]
      const month = date[1]

      if (!tree[year]) {
        tree[year] = {}
      }

      if (!tree[year][month]) {
        tree[year][month] = []
      }

      tree[year][month].push(product)
    })

    return tree
  }, [allProducts])

  const months = useMemo(
    () =>
      currentYear && yearTree[currentYear]
        ? Object.keys(yearTree[currentYear])
        : [],
    [yearTree, currentYear]
  )

  const monthName = (month: string) => MONTHS[parseInt(month) - 1]

  const [products, currentMonthName] = useMemo(() => {
    if (!yearTree[currentYear]) return [allProducts, '']

    if (!currentMonth) {
      return [
        Object.values(yearTree[currentYear]).reduce(
          (month, acc) => [...acc, ...month],
          []
        ),
        '',
      ]
    }

    if (!yearTree[currentYear][currentMonth]) return [[], '']

    return [yearTree[currentYear][currentMonth], monthName(currentMonth)]
  }, [yearTree, currentMonth, currentYear, allProducts])

  return (
    <Container clean>
      <CMS blockId={CMS_ID} single={PageBanner} />
      <Container className="py-8 mt-0 md:mt-8 items-center justify-center">
        <div className="flex flex-col gap-3 lg:gap-6 max-w-lg md:max-w-2xl mx-auto lg:max-w-6xl items-center justify-center">
          <div className="flex flex-col gap-4 items-center justify-center md:justify-start text-lg lg:text-2xl uppercase text-center">
            <Text variant="pageHeading">
              <Link href="/winners" scroll={false}>
                <a>Víťazi</a>
              </Link>
            </Text>

            <Tree
              links={Object.keys(yearTree)}
              active={currentYear}
              linkGenerator={(year) => `/winners?date=${year}`}
            />

            <Tree
              links={months}
              active={currentMonth}
              linkGenerator={(month) => `/winners?date=${currentYear}-${month}`}
              labelGenerator={monthName}
              customLinkClass="text-sm"
            />
          </div>

          <div className="">
            <Text variant="pageHeading">
              {date ? `${currentMonthName} ${currentYear}` : 'Všetko'}
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-8 py-2 gap-4 md:gap-8">
              {products.map((product) => (
                <ProductCard
                  variant="simple"
                  key={product.slug}
                  product={product}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Container>
  )
}

Winners.Layout = Layout

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: { date: query.date || '' },
})
