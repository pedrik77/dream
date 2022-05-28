import { flash as reactFlash } from 'react-universal-flash'

export const flash = (
  message: string,
  type: 'success' | 'danger' | 'warning' | 'info'
) => reactFlash(message, 4000, type)
