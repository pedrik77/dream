import { Layout } from '@components/common'
import WinnersLayout from '@components/winners/WinnersLayout'
import { GetServerSideProps } from 'next'
import React from 'react'

interface WinnersPageProps {
  date?: string
}

export default function Winners({ date = '' }: WinnersPageProps) {
  return <WinnersLayout current={date}></WinnersLayout>
}

Winners.Layout = Layout

export const getServerSideProps: GetServerSideProps = async ({ query }) => ({
  props: { date: query.date || '' },
})
