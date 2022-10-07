import cn from 'clsx'
import s from './Input.module.css'
import React, { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  variant?: 'dark' | 'ghost' | 'form' | 'cms'
  children?: React.ReactNode
  onChange?: (...args: any[]) => any
  labelClass?: string
}

const Input: React.FC<InputProps> = (props) => {
  const {
    className,
    labelClass = '',
    variant = 'dark',
    onChange,
    children,
    ...rest
  } = props

  const rootClassName = cn(
    s.root,
    {
      [s.ghost]: variant === 'ghost',
      [s.form]: variant === 'form',
      [s.cms]: variant === 'cms',
    },
    className
  )

  const handleOnChange = (e: any) => onChange && onChange(e.target.value, e)

  return (
    <label className={labelClass}>
      {children && <div>{children}</div>}
      <input
        className={rootClassName}
        onChange={handleOnChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        {...rest}
      />
    </label>
  )
}

export default Input
