import AccountLayout from '@components/auth/AccountLayout'
import { Layout } from '@components/common'
import { Col, DataGrid } from '@components/common/DataGrid'
import { Text } from '@components/ui'
import { useAuthContext } from '@lib/auth'
import { useOrders } from '@lib/orders'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function Prizes() {
  const { user } = useAuthContext()
  const orders = useOrders({ user: user?.email || '' })

  const router = useRouter()

  const { t } = useTranslation()

  const rows = useMemo(() => {
    const productMap: { [index: string]: any } = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productMap[item.product.slug]) {
          productMap[item.product.slug] = {
            product: item.product.title_1,
            ticketCount: item.ticketCount,
          }
        } else {
          productMap[item.product.slug].ticketCount += item.ticketCount
        }
      })
    })

    return Object.entries(productMap).map(
      ([slug, { product, ticketCount }]) => ({
        slug,
        product,
        ticketCount,
      })
    )
  }, [orders])

  return (
    <AccountLayout current="prizes">
      <Text variant="heading" className="mt-0 md:mt-8">
        {t('prizes.title')}
      </Text>

      <DataGrid
        rows={rows}
        columns={[]}
        rowIdKey="slug"
        onRowClick={(r) => router.push(`/products/${r.row.slug}`)}
      >
        <Col field="product" headerName={t('prizes.product')} width={400} />
        <Col
          field="ticketCount"
          headerName={t('prizes.ticketCount')}
          width={300}
        />
      </DataGrid>
    </AccountLayout>
  )
}

Prizes.Layout = Layout
