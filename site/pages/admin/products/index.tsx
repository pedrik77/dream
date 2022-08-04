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
import { DataGrid } from '@components/common/DataGrid'

const dateFormatter = (r: GridValueFormatterParams) => basicShowFormat(r.value)

const columns: GridColDef[] = [
  { field: 'slug', headerName: 'Slug', width: 170 },
  {
    field: 'title_1',
    headerName: 'Title 1',
    width: 350,
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
]

export default function Dashboard() {
  const [selected, setSelected] = useState<string[]>([])

  const products = useProducts({ showClosed: null, onError: handleErrorFlash })

  const router = useRouter()

  const handleDeleteSelected = async () => {
    if (!(await confirm('Naozaj?'))) return

    deleteProduct(selected)
      .then(() => flash(`Produkty (${selected.length}) odstránené`))
      .catch(handleErrorFlash)
  }

  const redirectToAddProduct = () => {
    router.push('/admin/products/add')

    // const prod = products[0]
    // if (!prod) return
    // console.log(prod)

    // Array(16)
    //   .fill(0)
    //   .forEach(() => {
    //     setProduct({ ...prod, slug: v4() })
    //   })
  }

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
          columns={columns}
          checkboxSelection
          onRowClick={(r) => router.push(`/admin/products/${r.id}`)}
          onSelectionModelChange={(selected) =>
            setSelected(selected as string[])
          }
          rowIdKey="slug"
        />
      </Container>
    </Permit>
  )
}

Dashboard.Layout = Layout
