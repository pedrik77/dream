import { Layout } from '@components/common'
import AccountLayout from '@components/auth/AccountLayout'
import { useOrders } from '@lib/orders'
import { basicShowFormat } from '@lib/date'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { DataGrid, Col } from '@components/common/DataGrid'
import { Text } from '@components/ui'
import { useMemo } from 'react'
import { useAuthContext } from '@lib/auth'

export default function Orders() {
  const { user } = useAuthContext()
  const orders = useOrders({
    user: user?.email || '',
  })
  const router = useRouter()

  const { t } = useTranslation()

  const rows = useMemo(
    () =>
      orders.map(({ uuid, created_date, items, total_price }) => ({
        uuid,
        created_date,
        products: items.map(({ product }) => product.title_1),
        ticketCount: items.map(({ ticketCount }) => ticketCount),
        total_price,
      })),
    [orders]
  )

  return (
    <AccountLayout current="orders">
      <Text variant="heading" className="mt-0 md:mt-8">
        {t('orders.title')}
      </Text>
      <DataGrid
        rows={rows}
        columns={[]}
        rowIdKey="uuid"
        // onRowClick={(r) => router.push(`/orders/${r.row.uuid}`)}
      >
        <Col
          field="created_date"
          headerName={t('date')}
          width={150}
          sortable
          filterable
        >
          {(r) => basicShowFormat(r.value)}
        </Col>
        <Col
          field="products"
          headerName={t('orders.product')}
          cellClassName="flex-col"
          align="center"
          width={400}
        >
          {(r) =>
            r.value.map((product_title: string) => (
              <div key={product_title} className="self-start">
                {product_title}
              </div>
            ))
          }
        </Col>
        <Col
          field="ticketCount"
          headerName={t('orders.ticketCount')}
          cellClassName="flex-col"
          align="center"
          width={130}
        >
          {(r) =>
            r.value.map((count: string, i: number) => (
              <div key={i} className="self-start">
                {count}
              </div>
            ))
          }
        </Col>
        <Col
          field="total_price"
          headerName={t('orders.totalPrice')}
          width={150}
          sortable
        >
          {(r) => `${r.value} €`}
        </Col>
      </DataGrid>
    </AccountLayout>
  )
}

Orders.Layout = Layout
