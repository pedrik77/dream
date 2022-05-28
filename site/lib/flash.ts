// @ts-ignore
import { flash as reactFlash } from 'react-universal-flash'

export const flash = (
  message: string,
  type: 'success' | 'danger' | 'warning' | 'info' = 'info'
) => reactFlash(message, 4000, type)
