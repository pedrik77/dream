import {
  ChangableComponent,
  ComponentData,
  ComponentsProps,
  EditorType,
  Settable,
  ValuesDefinition,
} from './types'
import { Button } from '@components/ui'
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getComponent, getEditor } from './getters'
import { useScrollDisable } from '@lib/hooks/useScrollDIsable'
import { usePermission } from '@lib/hooks/usePermission'
import { PERMISSIONS, useAuthContext } from '@lib/auth'
import { getCmsBlock, setCmsBlock } from './service'
import Swal from 'sweetalert2'
import { confirm } from '@lib/alerts'
import { getComponentSelectOptions, getComponentStarter } from './getters'
import { DEFAULT_ALLOWED, DEFAULT_FORBIDDEN } from '.'
import { Input } from './editors/input'

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

export function createEditor(
  definition: ValuesDefinition
): (props: Settable) => JSX.Element {
  const inputs = Object.entries(definition)
    .filter(([, d]) => d)
    .map(([name, d]) => {
      if (d === false) throw new Error('Should not happen')

      // @ts-ignore
      const [label = '', value = '', Editor] = d

      const type = typeof Editor === 'string' ? Editor : 'text'
      const Component: EditorType =
        !!Editor && typeof Editor !== 'string' ? Editor : Input

      return { Component, name, value, type, label }
    })

  return function Editor({ setData, ...data }) {
    return (
      <>
        {inputs.map(({ Component, name, ...props }) => (
          <Component
            key={name}
            {...props}
            onChange={(value) => setData({ ...data, [name]: value })}
          />
        ))}
      </>
    )
  }
}

export function ComponentRender({ type, value, draft }: ComponentData) {
  const permit = usePermission({ permission: 'CMS' })

  if (!permit && draft) return null

  const Component = getComponent(type)
  return <Component {...value} />
}

export function ComponentEditor({
  type,
  value,
  onChange,
  toggleMoving,
  toggleDraft,
  draft,
  isMoving,
  forceEdit = false,
  single = false,
  removeSelf,
}: ChangableComponent) {
  const [data, setData] = useState(value)
  const [isEditing, setIsEditing] = useState(false)

  const Editor = useMemo(() => getEditor(type), [type])

  useEffect(() => {
    if (forceEdit) setIsEditing(true)
  }, [forceEdit])

  useEffect(
    () => () => {
      if (forceEdit) onChange(data)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const editorRef = useRef(null)
  useScrollDisable(isEditing && !forceEdit ? editorRef.current : null)

  return (
    <div className="flex flex-col">
      <div
        className={`flex justify-end gap-2 right-4 mt-2 shadow-inner ${
          !forceEdit ? ' absolute top-30 z-30 ' : ''
        }`}
        ref={editorRef}
      >
        {!forceEdit && !isEditing && (
          <>
            <Button variant="cms" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            {!single && (
              <Button variant="cms" onClick={toggleMoving}>
                {isMoving ? 'Cancel' : 'Move'}
              </Button>
            )}
            <Button variant="cms" onClick={toggleDraft}>
              {draft ? 'Publish' : 'Unpublish'}
            </Button>
            {!single && (
              <Button variant="cms" onClick={removeSelf}>
                Remove
              </Button>
            )}
          </>
        )}
      </div>
      {isEditing && (
        <div
          className={`flex justify-center ${
            !forceEdit
              ? 'z-40 fixed top-20 py-12 h-5/6 overflow-y-scroll bg-primary w-full'
              : ''
          }`}
        >
          <div className={!forceEdit ? 'max-w-5xl' : ''}>
            {!forceEdit && (
              <>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="cms"
                    onClick={() => {
                      onChange(data)
                      setIsEditing(false)
                    }}
                  >
                    Save
                  </Button>
                  <Button variant="cms" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
            {/* @ts-ignore */}
            <Editor {...data} setData={setData} />
          </div>
        </div>
      )}
    </div>
  )
}

export function Components({
  blockId,
  children,
  forceEdit = false,
  forbidEdit = false,
  maxNumberOfComponents = -1,
  allowedComponents = DEFAULT_ALLOWED,
  forbiddenComponents = DEFAULT_FORBIDDEN,
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
    ({ position = 0 }: { position: number }) => {
      const disable =
        isMoving && (moving === position || moving === position - 1)

      return canEdit && !atMax ? (
        <div
          className={`flex justify-center my-4 ${disable ? 'opacity-25' : ''}`}
        >
          <Button
            className="rounded-2xl"
            type="button"
            onClick={
              isMoving ? () => move(position) : () => insertNew(position)
            }
          >
            {isMoving ? 'Move here' : '+'}
          </Button>
        </div>
      ) : null
    },
    [canEdit, atMax, isMoving, moving, insertNew, move]
  )

  useEffect(() => {
    if (!adminEditingMode) setMoving(-1)
  }, [adminEditingMode])

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
        <Fragment key={blockId + c.type + i}>
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
        </Fragment>
      ))}
    </>
  )
}
