import { Input as UiInput } from '@components/ui'
import { EditorType } from 'cms/types'
import React from 'react'

interface InputProps {
  type?: string
  placeholder?: string
}

export const Input: EditorType<string, InputProps> = ({
  value,
  onChange,
  label,
  type = 'text',
  placeholder = '',
}) => (
  <UiInput
    value={value}
    type={type}
    placeholder={placeholder}
    onChange={onChange}
    variant="cms"
  >
    {label}
  </UiInput>
)
