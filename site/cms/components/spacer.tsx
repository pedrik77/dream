import React from 'react'
import { ComponentConfig } from '../types'

type SpacesProps = {
  size: number
  backgroundColor: string
}

const config: ComponentConfig<SpacesProps> = {
  type: 'spacer',
  title: 'Spacer',
  Component: ({ size, backgroundColor }) => (
    <div
      style={{
        backgroundColor,
        height: size + 'px',
      }}
    />
  ),
  prompt: ['size'],
  valuesDefinition: {
    size: ['Výška', 200, 'number'],
    backgroundColor: [
      'Farba pozadia',
      '#fff',
      [
        ['Primary', '#491239'],
        ['Secondary', '#f5b612'],
        ['White', '#fff'],
      ],
    ],
  },
}

export default config
