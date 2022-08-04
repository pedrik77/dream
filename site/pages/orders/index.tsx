import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Bag } from '@components/icons'
import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import AccountLayout from '@components/auth/AccountLayout'
import { Order, useOrders } from '@lib/orders'
import { GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { getProduct } from '@lib/products'
import { basicShowFormat } from '@lib/date'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { handleErrorFlash } from '@components/ui/FlashMessage'
import { useTranslation } from 'react-i18next'
import { DataGrid } from '@components/common/DataGrid'

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

export default function Orders() {
  const orders = useOrders()
  const router = useRouter()

  const { t } = useTranslation()

  const [rows, setRows] = useState<any[]>([])
  // TODO sutaz, tickety, total
  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Dátum',
      sortable: true,
      filterable: true,
      width: 150,
      cellClassName: 'font-bold',
      headerClassName: 'text-[1rem] font-bold uppercase',
    },
    {
      field: 'total_price',
      headerName: 'Suma',
      width: 150,
      cellClassName: '',
      headerClassName: 'text-[1rem] font-bold uppercase',

      valueFormatter: (r) => `${r.value} €`,
    },

    {
      field: 'product_count',
      headerName: 'Počet súťaží',
      width: 150,
      headerClassName: 'text-[1rem] text font-bold uppercase',
    },
  ]

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
      <Text variant="heading" className="mt-0 md:mt-8">
        {t('orders.title')}
      </Text>
      <DataGrid
        rows={rows}
        columns={columns}
        rowIdKey="uuid"
        onRowClick={(r) => router.push(`/orders/${r.row.uuid}`)}
      />
    </AccountLayout>
  )
}

Orders.Layout = Layout
