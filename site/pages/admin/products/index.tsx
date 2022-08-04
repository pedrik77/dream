import { Layout } from '@components/common'
import { Button, Container, Text } from '@components/ui'
import { PERMISSIONS } from '@lib/auth'
import { GridColDef, GridValueFormatterParams } from '@mui/x-data-grid'
import Permit from '@components/common/Permit'
import { useEffect, useState } from 'react'
import { deleteProduct, Product, setProduct, useProducts } from '@lib/products'
import { basicShowFormat } from '@lib/date'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { useRouter } from 'next/router'
import { confirm } from '@lib/alerts'
import { Col, DataGrid } from '@components/common/DataGrid'
import { useTranslation } from 'react-i18next'

const dateFormatter = (r: GridValueFormatterParams) => basicShowFormat(r.value)

export default function Dashboard() {
  const products = useProducts({ showClosed: null, onError: handleErrorFlash })
  const router = useRouter()

  const { t } = useTranslation()

  const [selected, setSelected] = useState<string[]>([])

  const handleDeleteSelected = async () => {
    if (!(await confirm('Naozaj?'))) return

    deleteProduct(selected)
      .then(() => flash(`Produkty (${selected.length}) odstránené`))
      .catch(handleErrorFlash)
  }

  const redirectToAddProduct = () => router.push('/admin/products/add')

  return (
    <Permit permission={PERMISSIONS.PRODUCTS_LIST} redirect="/admin">
      <Container>
        <div>
          <Permit permission={PERMISSIONS.PRODUCTS_FORM}>
            <Button onClick={redirectToAddProduct}>Pridat produkt</Button>
          </Permit>
          <Permit permission={PERMISSIONS.PRODUCTS_DELETE}>
            <Button
              className={!!selected.length ? 'visible' : 'invisible'}
              onClick={handleDeleteSelected}
            >
              Vymazat ({selected.length})
            </Button>
          </Permit>
        </div>
        <DataGrid
          rows={products}
          columns={[]}
          checkboxSelection
          onRowClick={(r) => router.push(`/admin/products/${r.id}`)}
          onSelectionModelChange={(selected) =>
            setSelected(selected as string[])
          }
          rowIdKey="slug"
        >
          <Col field="slug" headerName="Slug" width={170} />
          <Col field="title_1" headerName="Názov" width={350} />
          <Col
            field="closing_date"
            headerName={t('product.closing')}
            valueFormatter={dateFormatter}
            width={130}
          />
          <Col
            field="winner_announce_date"
            headerName={t('product.winnerAnnounce')}
            valueFormatter={dateFormatter}
            width={130}
          />
        </DataGrid>
      </Container>
    </Permit>
  )
}

Dashboard.Layout = Layout
