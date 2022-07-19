import { Layout } from '@components/common'
import WinnersLayout from '@components/winners/WinnersLayout'
import { GetServerSideProps } from 'next'
import { Avatar } from '@components/common'
import { Container, Text } from '@components/ui'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment, useMemo } from 'react'
import { inputDateFormat } from '@lib/date'
import { Product, useProducts } from '@lib/products'
import { ProductCard } from '@components/product'

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

  const products = useMemo(() => {
    if (!yearTree[currentYear]) return []

    if (!yearTree[currentYear][currentMonth]) return []

    return yearTree[currentYear][currentMonth]
  }, [yearTree, currentMonth, currentYear])

  const treeClass =
    'flex flex-row lg:flex-col gap-4 justify-center items-center text-lg md:text-xl'

  return (
    <Container className="pt-4 mt-0 md:mt-8">
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
        <div className="lg:w-1/3 flex flex-col gap-4 pr-4 pb-8 mx-2 g:mx-4 border-b-[1px] lg:border-r-[1px] border-opacity-70 border-primary items-center justify-center md:justify-start text-lg lg:text-2xl uppercase text-center">
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
                              : 'text-primary hover:border-b-2 border-secondary'
                          }
                        >
                          {MONTHS[parseInt(month) - 1]}
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
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </Container>
  )
}

Winners.Layout = Layout

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: { date: query.date || '' },
})
