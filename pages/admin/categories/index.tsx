import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import { Col, DataGrid } from '@components/common/DataGrid'
import Permit from '@components/common/Permit'
import { Button, Container, Input, Text } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { confirm } from '@lib/api/page/alerts'
import { PERMISSIONS } from '@lib/api/page/auth'
import {
  Category,
  deleteCategory,
  setCategory,
  useCategories,
} from '@lib/categories'
import { uploadFile } from '@lib/api/page/files'
import { usePermission } from '@lib/hooks/usePermission'
import { GridEventListener } from '@mui/x-data-grid'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function Categories() {
  const categories = useCategories()
  const { t } = useTranslation()

  const [addNew, setAddNew] = useState(false)
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')

  const [selected, setSelected] = useState<string[]>([])

  const editPermitted = usePermission({
    permission: PERMISSIONS.CATEGORIES_FORM,
  })

  const reset = () => {
    setSlug('')
    setTitle('')
    setAddNew(false)
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
      <AdminLayout>
        <Text variant="heading">Upraviť kategórie</Text>
        {addNew ? (
          <Permit permission={PERMISSIONS.CATEGORIES_FORM}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
              <fieldset className="flex flex-col gap-4">
                <Input
                  variant="ghost"
                  type="text"
                  value={title}
                  placeholder={t('title')}
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
                <Button className="h-[100%]">{t('save')}</Button>
                <Button
                  className="h-[100%] mb-2"
                  variant="ghost"
                  type="button"
                  onClick={reset}
                >
                  {t('cancel')}
                </Button>
              </fieldset>
            </form>
          </Permit>
        ) : (
          <>
            <Permit permission={PERMISSIONS.CATEGORIES_FORM}>
              <Button
                className="h-[100%] mr-2"
                variant="ghost"
                type="button"
                onClick={() => setAddNew(true)}
              >
                {t('admin.addNewCategory')}
              </Button>
            </Permit>
            <Permit permission={PERMISSIONS.CATEGORIES_DELETE}>
              <Button
                onClick={handleDeleteSelected}
                disabled={!selected.length}
                type="button"
              >
                {t('delete')} ({selected.length})
              </Button>
            </Permit>
          </>
        )}
        <DataGrid
          rows={categories}
          checkboxSelection
          onSelectionModelChange={(selected) =>
            setSelected(selected as string[])
          }
          onCellEditCommit={handleEdit}
          rowIdKey="slug"
        >
          <Col field="slug" headerName="Slug" />
          <Col
            field="title"
            headerName={`${t('title')} (dbl-click to edit)`}
            editable
            width={300}
          />
        </DataGrid>
      </AdminLayout>
    </Permit>
  )
}

Categories.Layout = Layout
