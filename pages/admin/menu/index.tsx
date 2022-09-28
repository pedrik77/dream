import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import { Col, DataGrid } from '@components/common/DataGrid'
import Permit from '@components/common/Permit'
import { Button, Input, Text } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { confirm } from '@lib/alerts'
import { PERMISSIONS } from '@lib/auth'
import { categoryHref, categoryToSelect, useCategories } from '@lib/categories'
import { deleteMenuItem, Link, setMenuItem, useMenu } from '@lib/menu'
import _ from 'lodash'
import dynamic from 'next/dynamic'
import React, { useMemo, useEffect, useState } from 'react'
import { PropsValue } from 'react-select'
import { pageHref, usePages, pageToSelect } from '@lib/pages'
import { useTranslation } from 'react-i18next'

const Select = dynamic(import('react-select'), { ssr: false })

const isLegalOptions = [
  { label: 'Hlavné menu', value: 'main' },
  { label: 'Legal menu', value: 'legal' },
]
const generateHref = (type: string, value: string) => {
  if (type === 'manual') return ''

  if (type === 'category') return categoryHref(value)

  if (type === 'page') return pageHref(value)

  return value
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
  const pages = usePages()
  const menu = useMenu({ withHidden: true })
  const { t } = useTranslation()

  const [showForm, setShowForm] = useState(false)
  const [href, setHref] = useState('')
  const [label, setLabel] = useState('')
  const [isLegal, setIsLegal] = useState(false)
  const [menuPosition, setMenuPosition] = useState<number | null>(null)

  const [selected, setSelected] = useState<string[]>([])
  const [columnSelected, setColumnSelected] = useState('')

  const [isCustom, setIsCustom] = useState(true)

  const [isEditing, setIsEditing] = useState(false)

  const customLinkOptions = useMemo(
    () => [
      { label: 'Manual', value: 'manual', type: 'manual' },
      {
        label: 'Kategórie',
        options: categories.map(categoryToSelect),
      },
      { label: 'Stránky', options: pages.map(pageToSelect) },
    ],
    [categories, pages]
  )

  useEffect(() => {
    if (!selected.length) return setColumnSelected('')
  }, [selected])

  useEffect(() => {
    isEditing && setShowForm(true)
  }, [isEditing])

  const reset = () => {
    setHref('')
    setLabel('')
    setIsLegal(false)
    setMenuPosition(null)

    setIsCustom(true)
    setIsEditing(false)

    setSelected([])
    setShowForm(false)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    if (!href || !label) return flash('Vyplňte všetky polia', 'danger')

    if (menu.all.map((i) => i.href).includes(href) && !isEditing) {
      const confirmed = await confirm(
        'Rovnaký link už existuje, prajete si ho prepísať?'
      )

      if (!confirmed) return
    }

    setMenuItem({ href, label, is_legal: isLegal, menu_position: menuPosition })
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

    setIsEditing(true)

    setHref(item.href)
    setLabel(item.label)
    setIsLegal(!!item.is_legal)
    setMenuPosition(item.menu_position)

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Permit permission={PERMISSIONS.MENU_LIST} redirect={'/admin'}>
      <AdminLayout>
        <Text variant="heading">{t('admin.editMenu')}</Text>

        {showForm ? (
          <Permit permission={PERMISSIONS.MENU_FORM}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 my-6">
              <fieldset className="flex flex-col gap-4">
                <Input
                  variant="ghost"
                  type="text"
                  value={label}
                  placeholder="Label"
                  onChange={setLabel}
                />
                <Input
                  variant="ghost"
                  type="text"
                  value={href}
                  placeholder="Link"
                  onChange={setHref}
                  disabled={!isCustom || isEditing}
                />
              </fieldset>
              <fieldset className="flex flex-col gap-4">
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
                    value={
                      flattenOptions(customLinkOptions).find(
                        // @ts-ignore
                        (o) => href === generateHref(o.type, o.value)
                      ) || customLinkOptions[0]
                    }
                    defaultValue={customLinkOptions[0]}
                  />
                )}
              </fieldset>
              <fieldset className="flex gap-4 my-4 h-[100%]">
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
            <Permit permission={PERMISSIONS.MENU_FORM}>
              <Button
                className="h-[100%] mr-2 mb-4"
                variant="ghost"
                type="button"
                onClick={() => setShowForm(true)}
              >
                {t('admin.addNewMenuItem')}
              </Button>
            </Permit>
            <Permit permission={PERMISSIONS.MENU_DELETE}>
              <Button
                onClick={handleDeleteSelected}
                disabled={!selected.length}
                type="button"
              >
                {t('delete')} ({selected.length}){' '}
                {!!selected.length && t('admin.from') + ': ' + columnSelected}
              </Button>
            </Permit>
          </>
        )}
        <div className="flex ">
          {Object.entries({
            'Hlavné menu': menu.main,
            'Legal menu': menu.legal,
          }).map(([label, items]) => (
            <div key={label} className="flex-1">
              <h3>{label}</h3>
              <DataGrid
                rows={items}
                columns={[]}
                checkboxSelection
                isRowSelectable={() =>
                  columnSelected === label || !columnSelected
                }
                onSelectionModelChange={(selected) => {
                  setColumnSelected(label)
                  setSelected(selected as string[])
                }}
                onCellClick={(r) =>
                  (r.field === 'label' || r.field === 'href') &&
                  handleEdit(r.row.href)
                }
                rowIdKey="href"
              >
                <Col
                  field="label"
                  headerName="Label (click to edit)"
                  width={160}
                >
                  {(r) =>
                    (r.row.menu_position === null ? '(x) ' : '') + r.value
                  }
                </Col>
                <Col field="href" headerName="Link" width={130} />
                <Col field="menu_position" headerName="Pozícia" width={150}>
                  {(r) => {
                    const item = menu.all.find(
                      ({ href }) => href === r.row.href
                    )

                    if (!item) return ''

                    const group = (
                      item?.is_legal ? menu.legal : menu.main
                    ).filter((i) => i.menu_position !== null)

                    return (
                      <PositionControls
                        item={item}
                        group={group}
                        onSwap={reset}
                      />
                    )
                  }}
                </Col>
              </DataGrid>
            </div>
          ))}
        </div>
      </AdminLayout>
    </Permit>
  )
}

Menu.Layout = Layout

interface PositionControlsProps {
  item: Link
  group: Link[]
  onSwap?: (a: Link, b: Link) => void
}

const PositionControls = ({ item, group, onSwap }: PositionControlsProps) => {
  const index = group.indexOf(item)

  // @ts-ignore
  const positions: number[] = group.map((i) => i.menu_position)

  const swap = (a: Link, b: Link) => {
    const positionA = a.menu_position
    const positionB = b.menu_position

    if (positionA === null || positionB === null) return

    const positionedA = { ...a, menu_position: positionB }
    const positionedB = { ...b, menu_position: positionA }

    Promise.all([setMenuItem(positionedA), setMenuItem(positionedB)])
      .then(() => onSwap && onSwap(positionedA, positionedB))
      .catch(handleErrorFlash)
  }

  const onAdd = () =>
    setMenuItem({
      ...item,
      menu_position: positions.length ? Math.max(...positions) + 1 : 1,
    }).catch(handleErrorFlash)

  const onRemove = () =>
    setMenuItem({
      ...item,
      menu_position: null,
    }).catch(handleErrorFlash)

  const onUp = () => {
    if (index === 0) return

    swap(group[index - 1], item)
  }

  const onDown = () => {
    if (index === group.length - 1) return

    swap(item, group[index + 1])
  }

  return (
    <div className="flex gap-2">
      <div className="flex flex-col content-center w-full">
        {index !== 0 && item.menu_position !== null && (
          <button onClick={onUp}>Horo</button>
        )}
        {index !== group.length - 1 && item.menu_position !== null && (
          <button onClick={onDown}>Dolo</button>
        )}
      </div>
      <div>
        {item.menu_position === null && <button onClick={onAdd}>Pridat</button>}
        {item.menu_position !== null && (
          <button onClick={onRemove}>Odobrat</button>
        )}
      </div>
    </div>
  )
}
