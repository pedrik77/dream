import { InputEditorGetter } from 'cms/types'
import dynamic from 'next/dynamic'
import React from 'react'

const ReactSelect = dynamic(import('react-select'), { ssr: false })

export type Labels = string[] | string[][]

interface SelectProps {
  options?: Labels
}

const toOption = (value: string | string[]) => ({
  value: typeof value === 'string' ? value : value[1],
  label: typeof value === 'string' ? value : value[0],
})

export const getSelect: InputEditorGetter<string, SelectProps> =
  (defaults = {}) =>
  ({ value, onChange, label, options = defaults.options }) => {
    return (
      <label>
        <span className="text-white">{label}</span>
        {ReactSelect ? (
          // @ts-ignore
          <ReactSelect
            options={options?.map(toOption)}
            onChange={(e: any) => onChange(e.value)}
            value={toOption(value)}
          />
        ) : null}
      </label>
    )
  }

export const Select = getSelect()
