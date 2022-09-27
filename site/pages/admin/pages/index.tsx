import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import { Col, DataGrid } from '@components/common/DataGrid'
import Permit from '@components/common/Permit'
import { Button, Container, Input, Text } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { confirm } from '@lib/alerts'
import { PERMISSIONS } from '@lib/auth'
import { usePermission } from '@lib/hooks/usePermission'
import { deletePage, setPage, usePages } from '@lib/pages'
import { GridEventListener, GridValidRowModel } from '@mui/x-data-grid'
import _ from 'lodash'
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react'

export default function Pages() {
  const pages = usePages()

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
        <Permit permission={PERMISSIONS.PAGES_FORM}>
          <Text variant="heading">Upraviť stránky</Text>
          {addNew ? (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mt-6"
              >
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
            </>
          ) : (
            <>
              <Button
                className="h-[100%]"
                variant="ghost"
                type="button"
                onClick={() => setAddNew(true)}
              >
                Add new
              </Button>
            </>
          )}
        </Permit>
        <Permit permission={PERMISSIONS.PAGES_DELETE}>
          <div className={!!selected.length ? 'visible' : 'invisible'}>
            <Button onClick={handleDeleteSelected}>
              Delete {selected.length}
            </Button>
          </div>
        </Permit>
        <DataGrid
          rows={pages}
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

Pages.Layout = Layout