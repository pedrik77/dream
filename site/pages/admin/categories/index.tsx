import { Layout } from '@components/common'
import { Button, Container, Input } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import {
  Category,
  deleteCategory,
  setCategory,
  useCategories,
} from '@lib/categories'
import {
  DataGrid,
  GridColDef,
  GridEditRowsModel,
  GridEventListener,
} from '@mui/x-data-grid'
import _, { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'

const columns: GridColDef[] = [
  { field: 'slug', headerName: 'Slug' },
  { field: 'title', headerName: 'Title', editable: true },
  {
    field: 'menu_position',
    headerName: 'Menu position',
    editable: true,
    type: 'number',
  },
]

export default function Categories() {
  const { categories } = useCategories()

  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [menuPosition, setMenuPosition] = useState(-1)

  const [selected, setSelected] = useState<string[]>([])

  const reset = () => {
    setSlug('')
    setTitle('')
    setMenuPosition(-1)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    if (!slug || !title) return flash('Vyplňte všetky polia', 'danger')

    setCategory({ slug, title, menu_position: menuPosition })
      .then(() => {
        reset()
        flash('Kategória vytvorená')
      })
      .catch(handleErrorFlash)
  }

  const handleDeleteSelected = () => {
    if (!confirm('Naozaj?')) return

    const count = selected.length

    deleteCategory(selected)
      .then(() => flash(`Kategórie (${count}) odstránená`))
      .catch(handleErrorFlash)
  }

  const handleEdit: GridEventListener<'cellEditCommit'> = (e) => {
    const slug = e.id
    const edited = e.field
    const value = e.value

    const category = categories.find((c) => c.slug === slug)

    // @ts-ignore
    if (!category || category[edited] === value) return

    setCategory({ ...category, [edited]: value })
      .then(() => flash('Kategória upravená'))
      .catch(handleErrorFlash)
  }

  useEffect(() => setSlug(_.kebabCase(title)), [title])

  return (
    <Container className="flex flex-col gap-4">
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
          <Button className="h-[100%]">Pridat</Button>
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

      <div className={!!selected.length ? 'visible' : 'invisible'}>
        <Button onClick={handleDeleteSelected}>Delete {selected.length}</Button>
      </div>
      <div className="h-[500px]">
        <DataGrid
          rows={categories}
          columns={columns}
          pageSize={6}
          checkboxSelection
          onSelectionModelChange={(selected) =>
            setSelected(selected as string[])
          }
          onCellEditCommit={handleEdit}
          getRowId={(row: Category) => row.slug}
          disableSelectionOnClick
        />
      </div>
    </Container>
  )
}

Categories.Layout = Layout
