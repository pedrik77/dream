import { Layout } from '@components/common'
import { GetServerSideProps } from 'next'
import { Avatar } from '@components/common'
import { Container, Text } from '@components/ui'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment, useMemo } from 'react'
import { inputDateFormat } from '@lib/date'
import { Product, useProducts } from '@lib/products'
import { ProductCard } from '@components/product'
import PageBanner from '@components/ui/PageBanner'

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
  const allProducts = useProducts()

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

      const yearNumber = parseInt(year)

      ;[1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((add) => {
        const year = yearNumber + add
        if (!tree[year]) {
          tree[year] = {}
        }

        if (!tree[year][month]) {
          tree[year][month] = []
        }

        tree[year][month].push(product)
      })
    })

    return tree
  }, [allProducts])

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

  const treeClass =
    'flex flex-row lg:flex-col gap-4 justify-center items-center text-lg md:text-xl'

  return (
    <Container clean>
      <PageBanner
        primaryTitle="Lorem ipsum doleres chocolates"
        secondaryTitle="Neviem uz boha co"
        img="/assets/tesla1_1440x810.jpg"
      />
      <Container className="py-8 mt-0 md:mt-8 items-center justify-center">
        <div className="flex flex-col gap-3 lg:gap-6 max-w-lg md:max-w-2xl mx-auto lg:max-w-6xl items-center justify-center">
          <div className="flex flex-col gap-4 pr-4 pb-8 mx-2 g:mx-4 lg:border-r-[1px] border-opacity-70 border-primary items-center justify-center md:justify-start text-lg lg:text-2xl uppercase text-center">
            <Text variant="pageHeading">
              <Link href="/winners">
                <a>Víťazi</a>
              </Link>
            </Text>
            <div className={treeClass}>
              {Object.entries(yearTree).map(([year, monthTree]) => (
                <Fragment key={year}>
                  <Link href={`/winners?date=${year}`}>
                    <a
                      title={year}
                      className={
                        currentYear === year
                          ? 'border-b-2 border-primary border-opacity-70'
                          : 'text-primary hover:border-b-2 border-secondary'
                      }
                    >
                      {year}
                    </a>
                  </Link>

                  {currentYear === year && (
                    <div className={treeClass + ' pl-5 text-sm'}>
                      {Object.entries(monthTree).map(([month, winners]) => (
                        <Link
                          href={`/winners?date=${year}-${month}`}
                          key={`${month}/${year}`}
                        >
                          <a
                            title={month}
                            className={
                              currentMonth === month
                                ? 'border-b-2 border-primary border-opacity-70'
                                : 'text-accent-6 text-sm hover:text-primary'
                            }
                          >
                            {monthName(month)}
                          </a>
                        </Link>
                      ))}
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
          <div className="">
            {date && (
              <Text variant="pageHeading">
                {currentMonthName} {currentYear}
              </Text>
            )}
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
