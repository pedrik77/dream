import { ChangableComponent, ComponentData, Settable } from './types'
import { Button } from '@components/ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getComponent, getEditor } from './getters'
import { useScrollDisable } from '@lib/hooks/useScrollDIsable'

export function ComponentRender({ type, value }: ComponentData) {
  const Component = getComponent(type)
  return <Component {...value} />
}

export function ComponentEditor({
  type,
  value,
  onChange,
  toggleMoving,
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

  useEffect(() => () => {
    if (forceEdit) onChange(data)
  })

  const editorRef = useRef(null)
  useScrollDisable(isEditing && !forceEdit ? editorRef.current : null)

  if (!Editor) return null

  return (
    <div className="flex flex-col">
      <div
        className="flex justify-end gap-2 absolute top-30 right-4 mt-2 shadow-inner z-30"
        ref={editorRef}
      >
        {!forceEdit && !isEditing && (
          <>
            <Button
              variant="cms"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            {!single && (
              <Button variant="cms" type="button" onClick={toggleMoving}>
                {isMoving ? 'Cancel' : 'Move'}
              </Button>
            )}
            {!single && (
              <Button variant="cms" type="button" onClick={removeSelf}>
                Remove
              </Button>
            )}
          </>
        )}
      </div>
      {isEditing && (
        <div
          className={`flex justify-center  z-20 ${
            !forceEdit
              ? 'fixed top-20  py-12 h-5/6 overflow-y-scroll bg-primary w-full'
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
                    type="button"
                  >
                    Save
                  </Button>
                  <Button
                    variant="cms"
                    onClick={() => setIsEditing(false)}
                    type="button"
                  >
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
