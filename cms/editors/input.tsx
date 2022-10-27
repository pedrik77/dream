import { Input as UiInput } from '@components/ui'
import { page } from '@lib/api'
import { InputEditorGetter } from 'cms/types'
import React, { useState } from 'react'
import { v4 as uuid4 } from 'uuid'

interface InputProps {
  type?: string
  placeholder?: string
  onFile?: (file: File) => void
  imagePreview?: {
    width?: number
    height?: number
  }
  loading?: boolean
}

export const getInput: InputEditorGetter<string, InputProps> =
  (defaults = {}) =>
  ({
    value,
    onChange,
    label,
    onFile = defaults.onFile,
    placeholder = defaults.placeholder,
    type = defaults.type,
    imagePreview = defaults.imagePreview,
    loading = false,
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
          disabled={loading}
        >
          {label && (
            <>
              {label}
              <br />
            </>
          )}
          {loading && (
            <>
              loading...
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

export const getImageInput: InputEditorGetter<
  string,
  InputProps & {
    getPath?: () => string
    label?: string
  }
> =
  (defaults = {}) =>
  ({
    value,
    onChange,
    label = defaults.label,
    getPath = defaults.getPath,
    imagePreview = defaults.imagePreview,
  }) => {
    const [loading, setLoading] = useState(false)

    return (
      <Input
        value={value}
        type="file"
        onChange={console.log}
        onFile={(file) => {
          setLoading(true)

          page.files
            .upload(
              `${getPath ? getPath() : 'imgs'}/${file.name}_${uuid4()}`,
              file
            )
            .then((src) => {
              onChange(src)
              setLoading(false)
            })
        }}
        imagePreview={imagePreview || {}}
        label={label}
        loading={loading}
      />
    )
  }
