import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Bag } from '@components/icons'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import AccountLayout from '@components/auth/AccountLayout'
import { Order, useOrders } from '@lib/orders'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { getProduct } from '@lib/products'
import { basicShowFormat } from '@lib/date'
import Link from 'next/link'
import { useRouter } from 'next/router'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise

  return {
    props: { pages, categories },
  }
}

const columns: GridColDef[] = [
  {
    field: 'product',
    headerName: 'Product',
  },
  {
    field: 'price',
    headerName: 'Price',
    valueFormatter: (r) => `${r.value} €`,
  },
  { field: 'tickets', headerName: 'Tickets' },
  { field: 'date', headerName: 'Date' },
]

export default function Orders() {
  const orders = useOrders()

  const [rows, setRows] = useState<any[]>([])

  const router = useRouter()

  useEffect(() => {
    Promise.all(
      orders.map(async (order) => {
        const product = await getProduct(order.product_slug)

        return {
          uuid: order.uuid,
          product: product?.title_1,
          product_slug: product?.slug,
          price: order.total_price,
          tickets: order.ticket_count,
          date: basicShowFormat(order.created_date),
        }
      })
    ).then(setRows)
  }, [orders])

  return (
    <AccountLayout current="orders">
      <Text variant="pageHeading">My Orders</Text>
      <div className="w-full h-[600px]">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={6}
          getRowId={(row: Order) => row.uuid}
          disableSelectionOnClick
          getRowClassName={() => 'cursor-pointer'}
          onRowClick={(r) => router.push(`/products/${r.row.product_slug}`)}
        />
      </div>
    </AccountLayout>
  )
}

Orders.Layout = Layout
