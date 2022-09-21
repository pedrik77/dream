import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import { Col, DataGrid } from '@components/common/DataGrid'
import Permit from '@components/common/Permit'
import { Button, Container, Input, Text } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { confirm } from '@lib/alerts'
import { PERMISSIONS } from '@lib/auth'
import {
  Category,
  deleteCategory,
  setCategory,
  useCategories,
} from '@lib/categories'
import { uploadFile } from '@lib/files'
import { usePermission } from '@lib/hooks/usePermission'
import { GridEventListener, GridValidRowModel } from '@mui/x-data-grid'
import _ from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react'

export default function Categories() {
  const categories = useCategories()
  const router = useRouter()

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

    setCategory({ slug, title, banner: null })
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

  const handleNewBanner = async (
    category: Category,
    files: FileList | null
  ) => {
    const file = files?.item(0)

    if (!file) return

    const proceed = await confirm('Nahrať nový banner?')

    if (!proceed) return

    flash('Nahrávam avatar...', 'success')

    const path = `banner/${category.slug}`

    try {
      const src = await uploadFile(path, file)

      await setCategory({ ...category, banner: src })

      flash('Banner bude čoskoro nahradeny', 'success')
    } catch (e) {
      console.error(e)
      flash('Nastala chyba, skúste to prosīm znova', 'danger')
    }
  }

  useEffect(() => setSlug(_.kebabCase(title)), [title])

  return (
    <Permit permission={PERMISSIONS.CATEGORIES_LIST} redirect="/admin">
      <AdminLayout>
        <Permit permission={PERMISSIONS.CATEGORIES_FORM}>
          <Text variant="heading">Upraviť kategórie</Text>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
            <fieldset className="flex flex-col gap-4">
              <Input
                variant="ghost"
                type="text"
                value={title}
                placeholder="Title"
                onChange={setTitle}
              />
              <Input
                variant="ghost"
                type="text"
                value={slug}
                placeholder="Slug"
                onChange={setSlug}
              />
            </fieldset>

            <fieldset className="flex gap-4 h-[100%] mt-4">
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

        <Permit permission={PERMISSIONS.CATEGORIES_DELETE}>
          <div className={!!selected.length ? 'visible' : 'invisible'}>
            <Button onClick={handleDeleteSelected}>
              Delete {selected.length}
            </Button>
          </div>
        </Permit>
        <DataGrid
          rows={categories}
          columns={[]}
          checkboxSelection
          onSelectionModelChange={(selected) =>
            setSelected(selected as string[])
          }
          onCellEditCommit={handleEdit}
          rowIdKey="slug"
        >
          <Col field="slug" headerName="Slug" />
          <Col field="title" headerName="Názov" editable />
        </DataGrid>
      </AdminLayout>
    </Permit>
  )
}

Categories.Layout = Layout
