import {
  ChangableComponent,
  StarterCommon,
  ComponentsProps,
  InputEditor,
  Settable,
  ValuesDefinition,
} from './types'
import { Button, Text } from '@components/ui'
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useScrollDisable } from '@lib/hooks/useScrollDisable'
import { usePermission } from '@lib/hooks/usePermission'
import Swal from 'sweetalert2'
import {
  getComponentSelectOptions,
  getComponentStarter,
  getComponent,
  getEditor,
  getComponentTitle,
} from './getters'
import * as config from './config'
import { getInput } from './editors/input'
import { getCmsBlock, setCmsBlock } from '@lib/api/cms'
import { getSelect } from './editors/select'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { useAdminWidget } from '@lib/api/cms/adminWidget'
import { page } from '@lib/api'
import { PERMISSIONS } from '@lib/api/page/auth'

PERMISSIONS
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

const getInputEditor = (
  editor: string | string[] | InputEditor
): InputEditor => {
  if (!editor) return getInput({ type: 'text' })

  if (typeof editor === 'string') return getInput({ type: editor })

  if (Array.isArray(editor)) return getSelect({ options: editor })

  if (typeof editor === 'function') return editor

  // @ts-ignore
  return createEditor(editor)
}

export function createEditor<T = any>(
  definition: ValuesDefinition<T>,
  only: string[] = []
): (props: Settable<T>) => JSX.Element {
  const inputs = Object.entries(definition)
    .filter(([name, d]) => d && (!only.length || only.includes(name)))
    .map(([name, d]) => {
      if (d === false) throw new Error('Should not happen')

      // @ts-ignore
      const [labels = '', value = '', editor] = d

      const nested = typeof editor === 'object' && !Array.isArray(editor)

      const InputComponent = getInputEditor(editor)

      const Input = ({
        getData,
        onChange,
      }: Settable<
        T & {
          getData: (name?: string) => string | T
        }
      >) => {
        const { t } = useTranslation()

        const data = getData()

        const label = Array.isArray(labels) ? labels.map(t).join('') : t(labels)

        return (
          <InputComponent
            {...(typeof data !== 'string' ? data : {})}
            key={name}
            // @ts-ignore
            value={getData(name) ?? value}
            label={label}
            onChange={(value) => {
              // @ts-ignore
              onChange((data) => ({
                ...data,
                [name]: !nested ? value : { ...value },
              }))
            }}
          />
        )
      }

      return Input
    })

  return function Editor({ onChange, ...data }) {
    return (
      <>
        {inputs.map((Input, i) => (
          // @ts-ignore
          <Input
            key={i}
            onChange={onChange}
            getData={(name) => {
              // @ts-ignore
              if (!!name) return data[name]
              return data
            }}
          />
        ))}
      </>
    )
  }
}

export function ComponentRender({ type, value, draft }: StarterCommon) {
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
  isEditing,
  onEditing,
  isMoving,
  isHovering,
  forceEdit = false,
  single = false,
  removeSelf,
}: ChangableComponent) {
  const { t } = useTranslation()
  const { locale } = useRouter()
  const editorRef = useRef(null)
  useScrollDisable(isEditing && !forceEdit ? editorRef.current : null)

  const [data, setData] = useState({})

  const Editor = useMemo(() => getEditor(type), [type])

  useEffect(() => setData(value), [value])

  useEffect(
    () => () => {
      if (forceEdit) onChange(data)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <>
      <div
        className={`flex gap-2 mt-2 ml-4 transition-all ${
          !forceEdit ? ' absolute top-30 z-30' : ''
        } ${isHovering ? 'visible' : 'invisible'}`}
        ref={editorRef}
      >
        {!forceEdit && !isEditing && (
          <>
            {Editor !== null && (
              <Button variant="cms" onClick={() => onEditing(true)}>
                {t('edit')}
              </Button>
            )}
            {!single && (
              <Button variant="cms" onClick={toggleMoving}>
                {isMoving ? t('cancel') : t('cms.move')}
              </Button>
            )}
            <Button variant="cms" onClick={toggleDraft}>
              {draft ? t('cms.publish') : t('cms.unpublish')}
            </Button>
            {!single && (
              <Button variant="cms" onClick={removeSelf}>
                {t('remove')}
              </Button>
            )}
          </>
        )}
      </div>
      {isEditing && (
        <div
          className={`flex justify-center pb-4 ${
            !forceEdit
              ? 'z-50 fixed top-20 left-0 py-12 h-[90%] overflow-y-scroll bg-primary w-full'
              : ''
          }`}
        >
          <div className={!forceEdit ? 'max-w-5xl' : ''}>
            <Text variant="heading" className="text-white">
              {getComponentTitle(type)} ({locale?.toLocaleUpperCase()})
            </Text>
            {!forceEdit && (
              <>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="cms"
                    onClick={() => {
                      onChange(data)
                      onEditing(false)
                    }}
                  >
                    {t('finish')}
                  </Button>
                  <Button variant="cms" onClick={() => onEditing(false)}>
                    {t('cancel')}
                  </Button>
                </div>
              </>
            )}
            {/* @ts-ignore */}
            <Editor {...data} onChange={setData} />
          </div>
        </div>
      )}
    </>
  )
}

function Components({
  blockId,
  children,
  forceEdit = false,
  forbidEdit = false,
  maxNumberOfComponents = -1,
  allowedComponents = config.DEFAULT_ALLOWED,
  forbiddenComponents = config.DEFAULT_FORBIDDEN,
  single,
  onData,
  preventRender,
}: ComponentsProps) {
  const { t } = useTranslation()
  const loaded = useRef(false)
  const { isEditingMode, canShowWidget, needSaving } = useAdminWidget()
  const { locale, defaultLocale } = useRouter()

  const [components, setComponents] = useState<StarterCommon[]>([])
  const [moving, setMoving] = useState(-1)
  const [hovering, setHovering] = useState(-1)
  const [editing, setEditing] = useState<number[]>([])

  const shouldRender = !preventRender

  const canEdit =
    usePermission({ permission: PERMISSIONS.CMS }) &&
    (isEditingMode || forceEdit) &&
    !forbidEdit

  const isMoving = moving > -1

  const maxComp = !single ? maxNumberOfComponents : 1

  const atMax = useMemo(
    () => maxComp > 0 && components.length >= maxComp,
    [components, maxComp]
  )

  const componentTypes = getComponentSelectOptions({
    forbiddenComponents: !single ? forbiddenComponents : [],
    allowedComponents: !single ? allowedComponents : [single],
  })

  const saveComponents = useCallback(
    (components: StarterCommon[]) => {
      if (!canShowWidget) return
      return setCmsBlock({
        id: blockId,
        components,
      })
    },
    [blockId, canShowWidget]
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
      needSaving()
    },
    [components, moving, needSaving]
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

      needSaving()
    },
    [components, componentTypes, needSaving]
  )

  const handleEditComponent = useCallback(
    (key: number, isEditing: boolean) => {
      isEditing
        ? setEditing([...editing, key])
        : setEditing(editing.filter((i) => i !== key))
    },
    [editing]
  )

  const handleToggleDraft = useCallback(
    (key: number) => {
      const newComponents = [...components]
      newComponents[key].draft = !newComponents[key].draft
      setComponents(newComponents)
      needSaving()
    },
    [components, needSaving]
  )

  const handleRemoveSelf = useCallback(
    (key: number) => {
      const c = components.filter((_, j) => j !== key)

      page.alerts.confirm('Are you sure?').then((res) => {
        if (!res) return

        setComponents(c)
        needSaving()
      })
    },
    [components, needSaving]
  )

  const handleOnChange = useCallback(
    (key: number, value: any) => {
      const newComponents = components.map((c, i) =>
        key === i
          ? {
              ...c,
              value: locale === defaultLocale ? value : c.value,
              values: { ...c.values, [locale || '']: value },
            }
          : c
      )

      setComponents(newComponents)
      needSaving()
    },
    [components, locale, defaultLocale, needSaving]
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
            disabled={disable}
            onClick={
              isMoving ? () => move(position) : () => insertNew(position)
            }
          >
            {isMoving && !disable ? t('cms.moveHere') : '+'}
          </Button>
        </div>
      ) : null
    },
    [canEdit, atMax, isMoving, moving, insertNew, move, t]
  )

  useEffect(() => {
    if (!isEditingMode) setMoving(-1)
  }, [isEditingMode])

  useEffect(() => {
    loaded.current = true
    if (!!children) return setComponents(children)

    if (!blockId) return

    getCmsBlock(blockId)
      .then((block) => setComponents(block.components))
      .catch(console.error)
  }, [blockId, children])

  useEffect(() => onData && onData(components), [components, onData])

  useEffect(() => {
    if (!loaded.current || !components.length || isEditingMode) return

    saveComponents(components)
  }, [components, saveComponents, isEditingMode])

  return (
    <>
      <PlusButton position={0} />
      {components.map((c, i) => {
        const hover = (hover: boolean) =>
          setTimeout(() => setHovering(hover ? i : -1), 100)

        const value =
          !c.values ||
          locale === defaultLocale ||
          !locale ||
          !(locale in c.values)
            ? c.value
            : c.values[locale]

        const isEditing = editing.includes(i)
        const isHovering = hovering === i

        return (
          <Fragment key={blockId + c.type + i}>
            <div
              className={
                canEdit
                  ? 'outline outline-1 outline-secondary rounded'
                  : 'contents'
              }
              onMouseEnter={() => hover(true)}
              onMouseLeave={() => hover(false)}
            >
              {canEdit && (
                <ComponentEditor
                  isEditing={isEditing}
                  onEditing={(isEditing) => handleEditComponent(i, isEditing)}
                  onChange={(value) => handleOnChange(i, value)}
                  toggleMoving={() => setMoving(!isMoving ? i : -1)}
                  removeSelf={() => handleRemoveSelf(i)}
                  toggleDraft={() => handleToggleDraft(i)}
                  isMoving={isMoving}
                  isHovering={isHovering}
                  single={components.length === 1}
                  {...c}
                  value={value}
                />
              )}
              {shouldRender && <ComponentRender {...c} value={value} />}
            </div>
            <PlusButton position={i + 1} />
          </Fragment>
        )
      })}
    </>
  )
}

const CMS = Object.assign(Components, config.COMPONENTS)

export { CMS }
