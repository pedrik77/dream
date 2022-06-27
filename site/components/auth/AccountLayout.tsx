import { Avatar } from '@components/common'
import { Container } from '@components/ui'
import Image from 'next/image'
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
    <Container className="pt-4 mt-8">
      <div className="flex gap-3">
        <div className="w-1/3 flex flex-col gap-4 mx-4 border-r-[1px] border-opacity-70 border-primary items-center text-2xl uppercase text-center">
          <div className="flex justify-center align-center h-32 w-32">
            <Image height={200} width={200} alt="avatar" src="/icon.png" />
          </div>
          {tuples.map(([href, label]) => (
            <Link key={href} href={'/' + href}>
              <a
                title={label}
                className={
                  current === href
                    ? 'border-b-2 border-primary border-opacity-70'
                    : 'text-primary hover:border-b-2 border-secondary'
                }
              >
                {label}
              </a>
            </Link>
          ))}
        </div>
        <div className="">{children}</div>
      </div>
    </Container>
  )
}
export default AccountLayout
