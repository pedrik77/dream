import { Input as UiInput } from '@components/ui'
import { InputEditorGetter } from 'cms/types'
import React from 'react'

interface InputProps {
  type?: string
  placeholder?: string
  onFile?: (file: File) => void
  imagePreview?: {
    width?: number
    height?: number
  }
}

export const getInput: InputEditorGetter<string, InputProps> =
  (defaults = {}) =>
  ({
    value,
    onChange,
    label,
    onFile,
    placeholder = defaults.placeholder,
    type = defaults.type,
    imagePreview = defaults.imagePreview,
  }) =>
    (
      <>
        <UiInput
          value={type !== 'file' ? value : ''}
          type={type}
          placeholder={placeholder}
          onChange={(v, e) => {
            if (e.target.files?.[0] && onFile) {
              onFile(e.target.files[0])
            } else onChange(v)
          }}
          variant="cms"
          labelClass="text-white"
        >
          {label && (
            <>
              {label}
              <br />
            </>
          )}
        </UiInput>
        {type === 'file' && !!imagePreview && !!value && (
          <div className="m-4" style={{ ...imagePreview }}>
            <img
              src={value}
              alt="file"
              className="w-full"
              width={imagePreview.width}
              height={imagePreview.height}
            />
          </div>
        )}
        <br />
      </>
    )

export const Input = getInput()
