import { Layout } from '@components/common'
import { Button, Container, Text } from '@components/ui'
import { PERMISSIONS } from '@lib/auth'
import Permit from '@components/common/Permit'
import { useState } from 'react'
import { deleteProduct, Product, setProduct, useProducts } from '@lib/products'
import { basicShowFormat } from '@lib/date'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { useRouter } from 'next/router'
import { confirm } from '@lib/alerts'
import { Col, DataGrid } from '@components/common/DataGrid'
import { useTranslation } from 'react-i18next'
import AdminLayout from '@components/common/AdminLayout'

export default function Dashboard() {
  const { products } = useProducts({
    showClosed: null,
    onError: handleErrorFlash,
  })
  const router = useRouter()

  const { t } = useTranslation()

  const [selected, setSelected] = useState<string[]>([])

  const handleDeleteSelected = async () => {
    if (!(await confirm(t('admin.sure')))) return

    deleteProduct(selected)
      .then(() => flash(t('admin.deleted') + ': ' + selected.length))
      .catch(handleErrorFlash)
  }

  const redirectToAddProduct = () => router.push('/admin/products/add')

  return (
    <Permit permission={PERMISSIONS.PRODUCTS_LIST} redirect="/admin">
      <AdminLayout>
        <div>
          <Permit permission={PERMISSIONS.PRODUCTS_FORM}>
            <Text variant="heading">{t('admin.editProducts')}</Text>

            <Button onClick={redirectToAddProduct} className="my-4 mr-2">
              {t('admin.addNewProduct')}
            </Button>
          </Permit>
          <Permit permission={PERMISSIONS.PRODUCTS_DELETE}>
            <Button
              onClick={handleDeleteSelected}
              disabled={!selected.length}
              type="button"
            >
              {t('admin.delete')} ({selected.length})
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
          <Col field="title_1" headerName={t('admin.title')} width={350} />
          <Col
            field="closing_date"
            headerName={t('product.closing')}
            width={130}
          >
            {(r) => basicShowFormat(r.value)}
          </Col>
          <Col
            field="winner_announce_date"
            headerName={t('product.winnerAnnounce')}
            width={130}
          >
            {(r) => basicShowFormat(r.value)}
          </Col>
        </DataGrid>
      </AdminLayout>
    </Permit>
  )
}

Dashboard.Layout = Layout
