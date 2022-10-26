import AccountLayout from '@components/auth/AccountLayout'
import { Layout } from '@components/common'
import { Text } from '@components/ui'
import { getOrder, Order } from '@lib/api/shop/orders'
import { GetServerSideProps } from 'next'
import React from 'react'

interface OrderDetailProps {
  order: Order
}

export default function OrderDetail({ order }: OrderDetailProps) {
  return (
    <AccountLayout current="orders">
      <Text variant="pageHeading">Order # {order.uuid}</Text>
    </AccountLayout>
  )
}

export const getServerSideProps: GetServerSideProps<OrderDetailProps> = async ({
  params,
}) => {
  const order = await getOrder((params?.slug as string) || '')

  if (!order) return { notFound: true }

  return { props: { order } }
}

OrderDetail.Layout = Layout
