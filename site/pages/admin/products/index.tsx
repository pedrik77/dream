import { Layout } from '@components/common'
import { Button, Container, Text } from '@components/ui'
import { useUser } from '@lib/auth'
import Link from 'next/link'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import AdminPermit from '@components/magic/AdminPermit'
import { useEffect, useState } from 'react'
import { getProducts } from '@lib/products'

export default function Dashboard() {
  const { isAdmin, hasAdminPermission } = useUser()

  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    getProducts().then((data) => {
      console.log(data)
    })
  }, [])

  if (!isAdmin && !hasAdminPermission('products.list')) return null

  const rows = []

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title_1', headerName: 'Title 1', width: 130 },
    { field: 'title_2', headerName: 'Title 2', width: 130 },
    {
      field: 'short_desc',
      headerName: 'Short description',
      width: 260,
    },
    {
      field: 'closing_date',
      type: 'date',
      headerName: 'Closing date',
      width: 130,
    },
    {
      field: 'winner_announce_date',
      type: 'date',
      headerName: 'Winner announce date',
      width: 130,
    },
    { field: 'gallery_id', headerName: 'Gallery', width: 60 },
    { field: 'long_desc', headerName: 'Long description', width: 90 },
    { field: 'donation_entries', headerName: 'Donation entries', width: 90 },
  ]

  return (
    <Container className="grid lg:grid-cols-2 pt-4 gap-20">
      <div className="w-[80%] h-[600px] text-primary">
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={console.log}
        />
      </div>
    </Container>
  )
}

Dashboard.Layout = Layout
