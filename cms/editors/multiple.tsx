import { Button } from '@components/ui'
import { InputEditor, InputEditorGetter } from 'cms/types'

interface MultipleProps {
  editor?: InputEditor
  defaultValue?: any
}

export const getMultiple: InputEditorGetter<any[], MultipleProps> =
  (defaults = {}) =>
  ({
    value,
    onChange,
    label,
    editor: Editor = defaults.editor,
    defaultValue = defaults.defaultValue,
  }) => {
    return (
      <>
        <div>
          <Button
            variant="cms"
            onClick={() => onChange([defaultValue, ...value])}
          >
            +
          </Button>
          <Button variant="cms" onClick={() => onChange(value.slice(1))}>
            -
          </Button>
        </div>

        {value.map((single, i) => (
          // @ts-ignore
          <Editor
            key={i}
            value={single}
            onChange={(single: string) => {
              const newValue = [...value]
              newValue[i] = single
              onChange(newValue)
            }}
          />
        ))}
      </>
    )
  }
