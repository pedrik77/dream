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
import { handleErrorFlash } from '@components/ui/FlashMessage'

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
  { field: 'date', headerName: 'Date', sortable: true, filterable: true },
  {
    field: 'total_price',
    headerName: 'Total price',
    valueFormatter: (r) => `${r.value} €`,
  },
  { field: 'product_count', headerName: 'Pocet sutazi' },
]

export default function Orders() {
  const orders = useOrders()

  const [rows, setRows] = useState<any[]>([])

  const router = useRouter()

  useEffect(() => {
    Promise.all(
      orders.map(async (order) => {
        return {
          uuid: order.uuid,
          total_price: order.total_price,
          product_count: order.items.length,
          date: basicShowFormat(order.created_date),
        }
      })
    )
      .then(setRows)
      .catch(handleErrorFlash)
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
          onRowClick={(r) => router.push(`/orders/${r.row.uuid}`)}
        />
      </div>
    </AccountLayout>
  )
}

Orders.Layout = Layout
