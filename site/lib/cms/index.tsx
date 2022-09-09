import { Button } from '@components/ui'
import { PERMISSIONS, useAuthContext } from '@lib/auth'
import { getCmsBlock, setCmsBlock } from '@lib/cms/service'
import { usePermission } from '@lib/hooks/usePermission'
import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import { confirm } from '@lib/alerts'
import { ComponentEditor, ComponentRender } from './ui'
import { getComponentSelectOptions, getComponentStarter } from './getters'
import { ComponentData, ComponentsProps } from './types'

const selectType = async (options?: any) => {
  const optionKeys = Object.keys(options)

  if (optionKeys.length === 1) return { value: optionKeys[0] }

  return await Swal.fire({
    title: 'Insert new component',
    input: 'select',
    inputOptions: options,
    showCancelButton: true,
  })
}

export function Components({
  blockId,
  children,
  forceEdit = false,
  forbidEdit = false,
  maxNumberOfComponents = -1,
  allowedComponents = [],
  forbiddenComponents = ['text'],
}: ComponentsProps) {
  const loaded = useRef(false)
  const { adminEditingMode } = useAuthContext()
  const [components, setComponents] = useState<ComponentData[]>([])
  const [moving, setMoving] = useState(-1)

  const canEdit =
    usePermission({ permission: PERMISSIONS.CMS }) &&
    (adminEditingMode || forceEdit) &&
    !forbidEdit

  const isMoving = moving > -1

  const atMax = useMemo(
    () =>
      maxNumberOfComponents > 0 && components.length >= maxNumberOfComponents,
    [components, maxNumberOfComponents]
  )

  const componentTypes = getComponentSelectOptions({
    forbiddenComponents,
    allowedComponents,
  })

  const saveComponents = useCallback(
    (components: ComponentData[]) => {
      return setCmsBlock({
        id: blockId,
        components,
      })
    },
    [blockId]
  )

  const move = useCallback(
    (clicked: number) => {
      const newComponents = [...components].filter((_, j) => j !== moving)
      const movingComponent = components[moving]

      const slice = clicked > moving ? clicked - 1 : clicked

      setComponents(
        newComponents
          .slice(0, slice)
          .concat([movingComponent], newComponents.slice(slice))
      )

      setMoving(-1)
    },
    [components, moving]
  )

  const insertNew = useCallback(
    async (key?: number) => {
      const componentType = (await selectType(componentTypes)).value

      if (!componentType) return

      const starter = await getComponentStarter(componentType)

      // @ts-ignore
      if (!starter) return

      if (key === undefined) return setComponents([...components, starter])

      const newComponents = [...components]

      setComponents(
        newComponents.slice(0, key).concat([starter], newComponents.slice(key))
      )
    },
    [components, componentTypes]
  )

  const handleToggleDraft = useCallback(
    (key: number) => {
      const newComponents = [...components]
      newComponents[key].draft = !newComponents[key].draft
      setComponents(newComponents)
    },
    [components]
  )

  const handleRemoveSelf = useCallback(
    (key: number) => {
      const c = components.filter((_, j) => j !== key)

      confirm('Are you sure?').then((res) => {
        if (!res) return

        setComponents(c)
      })
    },
    [components]
  )

  const handleOnChange = useCallback(
    (key: number, value: any) => {
      const newComponents = components.map((c, i) =>
        key === i
          ? {
              ...c,
              value,
            }
          : c
      )

      setComponents(newComponents)
    },
    [components]
  )

  const PlusButton = useCallback(
    ({ position = 0 }: { position: number }) =>
      canEdit && !atMax ? (
        <div
          className={`flex justify-center my-2 ${
            isMoving && (moving === position || moving === position - 1)
              ? 'invisible'
              : ''
          }`}
        >
          <Button
            className="rounded-3xl"
            type="button"
            onClick={
              isMoving ? () => move(position) : () => insertNew(position)
            }
          >
            {isMoving ? 'Move here' : '+'}
          </Button>
        </div>
      ) : null,
    [canEdit, atMax, isMoving, moving, insertNew, move]
  )

  useEffect(() => {
    loaded.current = true
    if (!!children) return setComponents(children)

    if (!blockId) return

    getCmsBlock(blockId)
      .then((block) => {
        setComponents(block.components)
      })
      .catch(console.error)
  }, [blockId, children])

  useEffect(() => {
    if (!loaded.current || !components.length) return

    saveComponents(components)
  }, [components, saveComponents])

  return (
    <>
      <PlusButton position={0} />
      {components.map((c, i) => (
        <React.Fragment key={blockId + c.type + i}>
          <div className={canEdit ? 'shadow-md' : ''}>
            {canEdit && (
              <ComponentEditor
                onChange={(value) => handleOnChange(i, value)}
                toggleMoving={() => setMoving(!isMoving ? i : -1)}
                removeSelf={() => handleRemoveSelf(i)}
                toggleDraft={() => handleToggleDraft(i)}
                isMoving={isMoving}
                forceEdit={forceEdit}
                single={components.length === 1}
                {...c}
              />
            )}
            {!forceEdit ? <ComponentRender {...c} /> : null}
          </div>
          {<PlusButton position={i + 1} />}
        </React.Fragment>
      ))}
    </>
  )
}
