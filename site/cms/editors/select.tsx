import { InputEditorGetter } from 'cms/types'
import React from 'react'

interface SelectProps {
  options?: string[]
}

export const getSelect: InputEditorGetter<string, SelectProps> =
  (defaults = {}) =>
  ({ value, onChange, label, options = defaults.options }) => {
    return <div>select</div>
  }

export const Select = getSelect()
