import cn from 'clsx'
import React, { FC } from 'react'

interface ContainerProps {
  className?: string
  children?: any
  el?: HTMLElement
  clean?: boolean
}

const Container: FC<ContainerProps> = ({
  children,
  className,
  clean = false, // Full Width Screen
}) => {
  const rootClassName = cn(className, {
    'mx-auto max-w-7xl px-6 w-full': !clean,
  })

  return <div className={rootClassName}>{children}</div>
}

export default Container
