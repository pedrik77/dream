import { Layout } from '@components/common'
import { Button, Container, Text } from '@components/ui'
import { useUser } from '@lib/auth'
import Link from 'next/link'
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
  GridValueGetterParams,
} from '@mui/x-data-grid'
import AdminPermit from '@components/magic/AdminPermit'
import { useEffect, useState } from 'react'
import { deleteProduct, Product, useProducts } from '@lib/products'
import { basicShowFormat } from '@lib/date'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { useRouter } from 'next/router'

const dateFormatter = (r: GridValueFormatterParams) => basicShowFormat(r.value)

const columns: GridColDef[] = [
  { field: 'slug', headerName: 'Slug', width: 70 },
  {
    field: 'title_1',
    headerName: 'Title 1',
    width: 130,
    renderCell: (r) => <Link href={`/admin/products/${r.id}`}>{r.value}</Link>,
  },
  { field: 'title_2', headerName: 'Title 2', width: 130 },
  {
    field: 'short_desc',
    headerName: 'Short description',
    width: 260,
  },
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
  { field: 'gallery_id', headerName: 'Gallery', width: 60 },
  { field: 'long_desc', headerName: 'Long description', width: 90 },
  { field: 'donation_entries', headerName: 'Donation entries', width: 90 },
]

export default function Dashboard() {
  const { isAdmin, hasAdminPermission } = useUser()

  const [selected, setSelected] = useState<string[]>([])

  const products = useProducts()

  const router = useRouter()

  if (!isAdmin && !hasAdminPermission('products.list')) return null

  const handleDeleteSelected = () => {
    if (!confirm('Naozaj?')) return

    const count = selected.length

    deleteProduct(selected)
      .then(() => flash(`Produkty (${count}) odstránená`))
      .catch(handleErrorFlash)
  }

  return (
    <Container>
      <div>
        <Button onClick={() => router.push('/admin/products/add')}>New</Button>
        <Button
          className={!!selected.length ? 'visible' : 'invisible'}
          onClick={handleDeleteSelected}
        >
          Delete {selected.length}
        </Button>
      </div>
      <div className="w-[80%] h-[600px] text-primary">
        <DataGrid
          rows={products}
          columns={columns}
          checkboxSelection
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
