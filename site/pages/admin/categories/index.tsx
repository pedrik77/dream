import { Layout } from '@components/common'
import { Button, Container, Input } from '@components/ui'
import { flash } from '@components/ui/FlashMessage'
import { setCategory, useCategories } from '@lib/categories'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

export default function Categories() {
  const { categories } = useCategories()

  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [menuPosition, setMenuPosition] = useState(-1)

  const reset = () => {
    setSlug('')
    setTitle('')
    setMenuPosition(-1)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    if (!slug || !title) return flash('Vyplňte všetky polia', 'danger')

    setCategory(slug, title, menuPosition).then(() => {
      reset()

      flash('Kategória uložená')
    })
  }

  useEffect(() => setSlug(_.kebabCase(title)), [title])

  const columns: GridColDef[] = [
    { field: 'slug', headerName: 'Slug', width: 130 },
    { field: 'title', headerName: 'Title', width: 130 },
    { field: 'menu_position', headerName: 'Menu position', width: 60 },
  ]

  return (
    <Container className="flex flex-col gap-20">
      <form onSubmit={handleSubmit} className="flex">
        <fieldset className="flex-[60%]">
          <Input
            type="text"
            value={title}
            placeholder="Title"
            onChange={setTitle}
          />
          <Input
            type="text"
            value={slug}
            placeholder="Slug"
            onChange={setSlug}
          />
        </fieldset>

        <fieldset className="h-[100%]">
          <Button className="h-[100%]">Save</Button>
          <Button
            className="h-[100%]"
            variant="ghost"
            type="button"
            onClick={reset}
          >
            Cancel
          </Button>
        </fieldset>
      </form>

      <DataGrid
        rows={categories}
        columns={columns}
        checkboxSelection
        onSelectionModelChange={console.log}
        getRowId={(row) => row.slug}
      />
    </Container>
  )
}

Categories.Layout = Layout
