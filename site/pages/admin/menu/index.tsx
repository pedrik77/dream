import { Layout } from '@components/common'
import { Button, Container, Input } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { confirm } from '@lib/alerts'
import { PERMISSIONS } from '@lib/auth'
import { categoryHref, categoryToSelect, useCategories } from '@lib/categories'
import { usePermission } from '@lib/hooks/usePermission'
import { deleteMenuItem, Link, setMenuItem, useMenu } from '@lib/menu'
import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid'
import _ from 'lodash'
import dynamic from 'next/dynamic'
import React, { useMemo, useRef, useState } from 'react'
import { PropsValue } from 'react-select'

const Select = dynamic(import('react-select'), { ssr: false })

const columns: GridColDef[] = [
  { field: 'label', headerName: 'Label' },
  { field: 'href', headerName: 'Href' },
  { field: 'menu_position', headerName: 'Menu position' },
  { field: 'is_legal', headerName: 'Legal' },
]

const isLegalOptions = [
  { label: 'Hlavné menu', value: 'main' },
  { label: 'Legal menu', value: 'legal' },
]
const generateHref = (type: string, value: string) => {
  if (type === 'manual') return ''

  if (type === 'category') return categoryHref(value)

  return '/' + value
}

// @ts-ignore
const flattenOptions = (options) => {
  const flattened: PropsValue<{
    label: string
    type: string
    value: string
  }>[] = []

  // @ts-ignore
  options.forEach((option) => {
    if (!!option.value) {
      flattened.push(option)
    }

    if (!!option.options) {
      flattened.push(...option.options)
    }
  })

  return flattened
}

export default function Menu() {
  const categories = useCategories()
  const menu = useMenu(true)

  const [href, setHref] = useState('')
  const [label, setLabel] = useState('')
  const [isLegal, setIsLegal] = useState(false)

  const [selected, setSelected] = useState<string[]>([])

  const [isCustom, setIsCustom] = useState(true)

  const customLinkOptions = useMemo(
    () => [
      { label: 'Manual', value: 'manual', type: 'manual' },
      {
        label: 'Kategórie',
        options: categories.map(categoryToSelect),
      },
      { label: 'Stránky', options: [] },
    ],
    [categories]
  )

  if (!usePermission({ permission: PERMISSIONS.MENU, redirect: '/' }))
    return null

  const reset = () => {
    setHref('')
    setLabel('')
    setIsLegal(false)
    setIsCustom(true)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    if (!href || !label) return flash('Vyplňte všetky polia', 'danger')

    setMenuItem({ href, label, is_legal: isLegal, menu_position: -1 })
      .then(() => {
        reset()
        flash('Link uložený', 'success')
      })
      .catch(handleErrorFlash)
  }

  const handleDeleteSelected = async () => {
    if (!(await confirm('Naozaj?'))) return

    const count = selected.length

    deleteMenuItem(selected)
      .then(() => flash(`Linky (${count}) odstránené`, 'success'))
      .catch(handleErrorFlash)
  }

  const handleEdit = (href: string) => {
    const item = menu.all.find((i) => i.href === href)

    if (!item) return

    setHref(item.href)
    setLabel(item.label)
    setIsLegal(!!item.is_legal)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Container className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <fieldset>
          <Input
            type="text"
            value={label}
            placeholder="Label"
            onChange={setLabel}
          />
          <Input
            type="text"
            value={href}
            placeholder="Link"
            onChange={setHref}
            disabled={!isCustom}
          />
        </fieldset>
        <fieldset>
          {Select && (
            // @ts-ignore
            <Select
              options={isLegalOptions}
              onChange={(e: any) => setIsLegal(e.value === 'legal')}
              value={isLegal ? isLegalOptions[1] : isLegalOptions[0]}
            />
          )}

          {Select && (
            // @ts-ignore
            <Select
              options={customLinkOptions}
              onChange={({ type, value, label }: any) => {
                if (type === 'manual') {
                  setIsCustom(true)
                  setLabel('')
                } else {
                  setIsCustom(false)
                  setLabel(label)
                }
                setHref(generateHref(type, value))
              }}
              value={flattenOptions(customLinkOptions).find(
                // @ts-ignore
                (o) => href === generateHref(o.type, o.value)
              )}
              defaultValue={customLinkOptions[0]}
            />
          )}
        </fieldset>
        <fieldset className="h-[100%]">
          <Button className="h-[100%]">Ulozit</Button>
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
      <div>
        {Object.entries({
          'Hlavné menu': menu.main,
          'Legal menu': menu.legal,
        }).map(([label, items]) => (
          <div key={label} className="h-[500px] mb-16">
            <h3>{label}</h3>
            <DataGrid
              key={label}
              rows={items}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 15, 20]}
              checkboxSelection
              onSelectionModelChange={(selected) =>
                setSelected(selected as string[])
              }
              onRowClick={(r) => handleEdit(r.row.href)}
              getRowId={(row: Link) => row.href}
              disableSelectionOnClick
            />
          </div>
        ))}
      </div>
    </Container>
  )
}

Menu.Layout = Layout
