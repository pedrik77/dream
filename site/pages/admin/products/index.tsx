import { Layout } from '@components/common'
import { Button, Container, Text } from '@components/ui'
import { PERMISSIONS } from '@lib/auth'
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
} from '@mui/x-data-grid'
import AdminPermit from '@components/magic/AdminPermit'
import { useEffect, useState } from 'react'
import { deleteProduct, Product, useProducts } from '@lib/products'
import { basicShowFormat } from '@lib/date'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { useRouter } from 'next/router'
import { confirm } from '@lib/alerts'
import { usePermission } from '@lib/hooks/usePermission'

const dateFormatter = (r: GridValueFormatterParams) => basicShowFormat(r.value)

const columns: GridColDef[] = [
  { field: 'slug', headerName: 'Slug', width: 70 },
  {
    field: 'title_1',
    headerName: 'Title 1',
    width: 130,
  },
  { field: 'title_2', headerName: 'Title 2', width: 130 },
  { field: 'price', headerName: 'Price', width: 50 },
  {
    field: 'closing_date',
    headerName: 'Closing date',
    width: 130,
    valueFormatter: dateFormatter,
  },
  {
    field: 'winner_announce_date',
    headerName: 'Winner announce date',
    width: 130,
    valueFormatter: dateFormatter,
  },
  {
    field: 'short_desc',
    headerName: 'Short description',
    width: 260,
  },
]

export default function Dashboard() {
  const [selected, setSelected] = useState<string[]>([])

  const products = useProducts()

  const router = useRouter()

  if (usePermission({ permission: PERMISSIONS.PRODUCTS_LIST })) return null

  const handleDeleteSelected = async () => {
    if (!(await confirm('Naozaj?'))) return

    deleteProduct(selected)
      .then(() => flash(`Produkty (${selected.length}) odstránené`))
      .catch(handleErrorFlash)
  }

  return (
    <Container>
      <div>
        <AdminPermit permission={PERMISSIONS.PRODUCTS_ADD}>
          <Button onClick={() => router.push('/admin/products/add')}>
            Pridat produkt
          </Button>
        </AdminPermit>
        <Button
          className={!!selected.length ? 'visible' : 'invisible'}
          onClick={handleDeleteSelected}
        >
          Vymazat ({selected.length})
        </Button>
      </div>
      <div className="w-[80%] h-[600px] text-primary">
        <DataGrid
          rows={products}
          columns={columns}
          checkboxSelection
          onRowClick={(r) => router.push(`/admin/products/${r.id}`)}
          onSelectionModelChange={(selected) =>
            setSelected(selected as string[])
          }
          pageSize={6}
          getRowId={(row: Product) => row.slug}
          disableSelectionOnClick
        />
      </div>
    </Container>
  )
}

Dashboard.Layout = Layout
