import { Input as UiInput } from '@components/ui'
import { InputEditorGetter } from 'cms/types'
import React from 'react'

interface InputProps {
  type?: string
  placeholder?: string
}

export const getInput: InputEditorGetter<string, InputProps> =
  (defaults = {}) =>
  ({
    value,
    onChange,
    label,
    placeholder = defaults.placeholder,
    type = defaults.type,
  }) =>
    (
      <>
        <UiInput
          value={value}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          variant="cms"
        >
          {label && (
            <>
              {label}
              <br />
            </>
          )}
        </UiInput>
        <br />
      </>
    )

export const Input = getInput()
