import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import { Col, DataGrid } from '@components/common/DataGrid'
import Permit from '@components/common/Permit'
import { Button, Input, Text } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { confirm } from '@lib/api/page/alerts'
import { PERMISSIONS } from '@lib/api/page/auth'
import { usePermission } from '@lib/hooks/usePermission'
import { deletePage, setPage, usePages } from '@lib/api/cms/pages'
import { GridEventListener } from '@mui/x-data-grid'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function Pages() {
  const pages = usePages()
  const { t } = useTranslation()

  const [addNew, setAddNew] = useState(false)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')

  const [selected, setSelected] = useState<string[]>([])

  const editPermitted = usePermission({
    permission: PERMISSIONS.PAGES_FORM,
  })

  const reset = () => {
    setAddNew(false)
    setSlug('')
    setTitle('')
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    if (!slug || !title) return flash('Vyplňte všetky polia', 'danger')

    setPage({ slug, title })
      .then(() => {
        reset()
        flash('Stránka vytvorená')
      })
      .catch(handleErrorFlash)
  }

  const handleDeleteSelected = async () => {
    if (!(await confirm('Naozaj?'))) return

    const count = selected.length

    deletePage(selected)
      .then(() => flash(`Stránky (${count}) odstránené`))
      .catch(handleErrorFlash)
  }

  const handleEdit: GridEventListener<'cellEditCommit'> = (e) => {
    if (!editPermitted) return

    const slug = e.id
    const edited = e.field
    const value = e.value

    const page = pages.find((c) => c.slug === slug)

    // @ts-ignore
    if (!page || page[edited] === value) return

    setPage({ ...page, [edited]: value })
      .then(() => flash('Stránka upravená'))
      .catch(handleErrorFlash)
  }

  useEffect(() => setSlug(_.kebabCase(title)), [title])

  return (
    <Permit permission={PERMISSIONS.PAGES_LIST} redirect="/admin">
      <AdminLayout>
        <Text variant="heading">{t('admin.editPages')}</Text>
        {addNew ? (
          <Permit permission={PERMISSIONS.PAGES_FORM}>
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
                  className="h-[100%]"
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
            <Permit permission={PERMISSIONS.PAGES_FORM}>
              <Button
                className="h-[100%] mr-2"
                variant="ghost"
                type="button"
                onClick={() => setAddNew(true)}
              >
                {t('admin.addNewPage')}
              </Button>
            </Permit>
            <Permit permission={PERMISSIONS.PAGES_DELETE}>
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
          rows={pages}
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

Pages.Layout = Layout
