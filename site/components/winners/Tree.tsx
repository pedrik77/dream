import Link from 'next/link'
import React from 'react'

interface TreeProps {
  links: string[]
  current?: string
  linkGenerator: (link: string) => string
  labelGenerator?: (link: string) => string
  customClass?: string
  level?: number
}

export default function Tree({
  links,
  current,
  linkGenerator,
  labelGenerator = (link) => link,
  customClass = '',
  level = 1,
}: TreeProps) {
  const treeClass =
    'flex flex-row gap-4 justify-center items-center text-lg md:text-xl'

  const getLinkClass = (active: boolean) => {
    if (level === 1) {
      return active
        ? 'border-b-2 border-primary border-opacity-70'
        : 'text-primary hover:border-b-2 border-secondary'
    }

    return active
      ? 'border-b-2 text-sm border-primary border-opacity-70'
      : 'text-accent-6 text-sm hover:text-primary'
  }

  return (
    <div className={`${treeClass} ${customClass}`}>
      {links.map((link) => (
        <Link key={link} href={linkGenerator(link)} scroll={false}>
          <a title={link} className={getLinkClass(current === link)}>
            {labelGenerator(link)}
          </a>
        </Link>
      ))}
    </div>
  )
}
