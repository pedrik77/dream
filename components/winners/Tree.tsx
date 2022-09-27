import Link from 'next/link'
import React from 'react'
import s from './Tree.module.css'

interface TreeProps {
  links: string[]
  active?: string
  linkGenerator: (link: string) => string
  labelGenerator?: (link: string) => string
  customClass?: string
  customLinkClass?: string
}

export default function Tree({
  links,
  active,
  linkGenerator,
  labelGenerator = (link) => link,
  customClass = '',
  customLinkClass = '',
}: TreeProps) {
  return (
    <div className={`${s.root} ${customClass}`}>
      {links.map((link) => (
        <Link key={link} href={linkGenerator(link)} scroll={false}>
          <a
            title={link}
            className={`${s.link} ${
              active === link ? s.active : ''
            } ${customLinkClass}`}
          >
            {labelGenerator(link)}
          </a>
        </Link>
      ))}
    </div>
  )
}
