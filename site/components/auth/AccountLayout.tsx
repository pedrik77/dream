import { Container } from '@components/ui'
import Link from 'next/link'
import React from 'react'

const LINKS = {
  account: 'Nastavenie účtu',
  orders: 'Moje súťaže',
}

type LinkKey = keyof typeof LINKS

const AccountLayout: React.FC<{
  current?: LinkKey
  order?: Array<LinkKey>
}> = ({ children, current = '', order = [] }) => {
  const tuples = !!order.length
    ? order.map((href) => [href, LINKS[href]])
    : Object.entries(LINKS)

  return (
    <Container className="pt-4">
      <div className="flex gap-3">
        <div className="flex flex-col">
          {tuples.map(([href, label]) => (
            <Link key={href} href={'/' + href}>
              <a
                title={label}
                className={current === href ? 'underline' : 'text-primary'}
              >
                {label}
              </a>
            </Link>
          ))}
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </Container>
  )
}
export default AccountLayout
