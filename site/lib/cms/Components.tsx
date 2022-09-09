import { Button } from '@components/ui'
import { PERMISSIONS, useAuthContext } from '@lib/auth'
import { getCmsBlock, setCmsBlock } from '@lib/cms/service'
import { usePermission } from '@lib/hooks/usePermission'
import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import { confirm } from '@lib/alerts'
import { Component, ComponentEditor } from './ui'
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
  forbiddenComponents = ['text', 'image'],
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

      const starter = getComponentStarter(componentType)

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
        <>
          <div
            key={blockId + c.type + i}
            className={canEdit ? 'shadow-md' : ''}
          >
            {canEdit && (
              <ComponentEditor
                forceEdit={forceEdit}
                single={components.length === 1}
                toggleMoving={() => setMoving(!isMoving ? i : -1)}
                isMoving={isMoving}
                removeSelf={() => {
                  const c = components.filter((_, j) => j !== i)

                  confirm('Are you sure?').then((res) => {
                    if (!res) return

                    setComponents(c)
                  })
                }}
                onChange={(value) => {
                  const newComponents = components.map((c, j) =>
                    i === j
                      ? {
                          ...c,
                          value,
                        }
                      : c
                  )

                  setComponents(newComponents)
                }}
                {...c}
              />
            )}
            {!forceEdit && <Component {...c} />}
          </div>
          {!atMax && <PlusButton position={i + 1} />}
        </>
      ))}
    </>
  )
}
