import { Layout } from '@components/common'
import { DataGrid } from '@components/common/DataGrid'
import Permit from '@components/common/Permit'
import { Button, Container, Input } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { confirm } from '@lib/alerts'
import { PERMISSIONS } from '@lib/auth'
import {
  Category,
  deleteCategory,
  setCategory,
  useCategories,
} from '@lib/categories'
import { usePermission } from '@lib/hooks/usePermission'
import { GridColDef, GridEventListener } from '@mui/x-data-grid'
import _, { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'

const columns: GridColDef[] = [
  { field: 'slug', headerName: 'Slug' },
  { field: 'title', headerName: 'Title', editable: true },
]

export default function Categories() {
  const categories = useCategories()

  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')

  const [selected, setSelected] = useState<string[]>([])

  const editPermitted = usePermission({
    permission: PERMISSIONS.CATEGORIES_FORM,
  })

  const reset = () => {
    setSlug('')
    setTitle('')
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    if (!slug || !title) return flash('Vyplňte všetky polia', 'danger')

    setCategory({ slug, title })
      .then(() => {
        reset()
        flash('Kategória vytvorená')
      })
      .catch(handleErrorFlash)
  }

  const handleDeleteSelected = async () => {
    if (!(await confirm('Naozaj?'))) return

    const count = selected.length

    deleteCategory(selected)
      .then(() => flash(`Kategórie (${count}) odstránené`))
      .catch(handleErrorFlash)
  }

  const handleEdit: GridEventListener<'cellEditCommit'> = (e) => {
    if (!editPermitted) return

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
    <Permit permission={PERMISSIONS.CATEGORIES_LIST} redirect="/admin">
      <Container className="flex flex-col gap-4">
        <Permit permission={PERMISSIONS.CATEGORIES_FORM}>
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
        </Permit>

        <div className={!!selected.length ? 'visible' : 'invisible'}>
          <Button onClick={handleDeleteSelected}>
            Delete {selected.length}
          </Button>
        </div>
        <DataGrid
          rows={categories}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(selected) =>
            setSelected(selected as string[])
          }
          onCellEditCommit={handleEdit}
          rowIdKey="slug"
        />
      </Container>
    </Permit>
  )
}

Categories.Layout = Layout
