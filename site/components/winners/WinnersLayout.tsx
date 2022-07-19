import { Avatar } from '@components/common'
import { Container, Text } from '@components/ui'
import { useWinners, Winner } from '@lib/winners'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment, useMemo } from 'react'
import { inputDateFormat } from '@lib/date'

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

const WinnersLayout: React.FC<{
  current?: string
}> = ({ children, current = '' }) => {
  const winners = useWinners()

  const currentMonth = current.split('-')[1]
  const currentYear = current.split('-')[0]

  const yearTree = useMemo(() => {
    const tree: {
      [index: string]: { [index: string]: Winner[] }
    } = {}

    winners.forEach((winner) => {
      const date = inputDateFormat(winner.product.closing_date).split('-')
      const year = date[0]
      const month = date[1]

      if (!tree[year]) {
        tree[year] = {}
      }

      if (!tree[year][month]) {
        tree[year][month] = []
      }

      tree[year][month].push(winner)
    })

    return tree
  }, [winners])

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
        <div className="">{children}</div>
      </div>
    </Container>
  )
}
export default WinnersLayout
