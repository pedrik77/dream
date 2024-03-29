import AccountLayout from '@components/auth/AccountLayout'
import { Layout } from '@components/common'
import { Col, DataGrid } from '@components/common/DataGrid'
import { Text } from '@components/ui'
import { basicShowFormat } from '@lib/api/page/date'
import { usePrizes } from '@lib/api/shop/orders'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

export default function Prizes() {
  const rows = usePrizes()

  const { t } = useTranslation()

  const router = useRouter()

  return (
    <AccountLayout current="prizes">
      <Text variant="heading" className="mt-0 md:mt-8">
        {t('prizes.title')}
      </Text>

      <DataGrid
        rows={rows}
        rowIdKey="slug"
        onRowClick={(r) => router.push(`/products/${r.row.slug}`)}
      >
        <Col field="product" headerName={t('prizes.product')} width={400} />
        <Col
          field="ticket_count"
          headerName={t('prizes.ticketCount')}
          width={290}
        />
        <Col
          field="last_order_date"
          headerName={t('prizes.lastOrder')}
          width={180}
          sortable
        >
          {(r) => basicShowFormat(r.value)}
        </Col>
      </DataGrid>
    </AccountLayout>
  )
}

Prizes.Layout = Layout
