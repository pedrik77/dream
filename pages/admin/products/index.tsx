import { Layout } from '@components/common'
import { Button, Container, Text } from '@components/ui'
import { PERMISSIONS } from '@lib/auth'
import Permit from '@components/common/Permit'
import { useState } from 'react'
import { deleteProduct, Product, setProduct, useProducts } from '@lib/products'
import { basicShowFormat } from '@lib/date'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { useRouter } from 'next/router'
import { confirm, prompt } from '@lib/alerts'
import { Col, DataGrid } from '@components/common/DataGrid'
import { useTranslation } from 'react-i18next'
import AdminLayout from '@components/common/AdminLayout'

export default function Dashboard() {
  const router = useRouter()

  const { products } = useProducts({
    showClosed: null,
    onError: handleErrorFlash,
  })

  const { products: missingWinnerProducts } = useProducts({
    showClosed: true,
    winnerAnnounced: false,
    orderDirection: 'asc',
    onError: handleErrorFlash,
  })

  const { t } = useTranslation()

  const [selected, setSelected] = useState<string[]>([])

  const handleDeleteSelected = async () => {
    if (!(await confirm(t('sure')))) return

    deleteProduct(selected)
      .then(() => flash(t('deleted') + ': ' + selected.length))
      .catch(handleErrorFlash)
  }

  const handleWinnerDraw = async () => {
    const productSlug = await prompt(t('winners.draw'), {
      input: 'select',
      inputOptions: missingWinnerProducts.reduce(
        (acc: Record<string, string>, product) => {
          acc[product.slug] = product.title_1
          return acc
        },
        {}
      ),
      confirmButtonText: t('start'),
    })

    if (!productSlug) return

    router.push(`/admin/winners/draw?product=${productSlug}`)
  }

  const redirectToAddProduct = () => router.push('/admin/products/add')

  return (
    <Permit permission={PERMISSIONS.PRODUCTS_LIST} redirect="/admin">
      <AdminLayout>
        <div>
          <Permit permission={PERMISSIONS.PRODUCTS_FORM}>
            <Text variant="heading">{t('admin.editProducts')}</Text>

            <Button
              onClick={redirectToAddProduct}
              className="my-4 mr-2"
              variant="ghost"
              type="button"
            >
              {t('admin.addNewProduct')}
            </Button>
          </Permit>
          <Permit permission={PERMISSIONS.PRODUCTS_DELETE}>
            <Button
              onClick={handleDeleteSelected}
              className="my-4 mr-2"
              disabled={!selected.length}
              type="button"
            >
              {t('delete')} ({selected.length})
            </Button>
          </Permit>
          <Permit permission={PERMISSIONS.WINNERS_DRAW}>
            {
              <Button
                onClick={handleWinnerDraw}
                disabled={!missingWinnerProducts.length}
                type="button"
              >
                {t('winners.draw')} ({missingWinnerProducts.length})
              </Button>
            }
          </Permit>
        </div>
        <DataGrid
          rows={products}
          checkboxSelection
          onRowClick={(r) => router.push(`/admin/products/${r.id}`)}
          onSelectionModelChange={(selected) =>
            setSelected(selected as string[])
          }
          rowIdKey="slug"
        >
          <Col field="slug" headerName="Slug" width={170} />
          <Col field="title_1" headerName={t('title')} width={350} />
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
