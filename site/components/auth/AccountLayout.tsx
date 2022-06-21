import { Container } from '@components/ui'
import Link from 'next/link'
import React from 'react'

const AccountLayout: React.FC = ({ children }) => {
  return (
    <Container className="pt-4">
      <div className="flex gap-3">
        <div className="flex flex-col ">
          <Link href="/account">
            <a className="text-primary-600 hover:text-gray-800">
              Nastavenie účtu
            </a>
          </Link>
          <Link href="/orders">
            <a className="text-primary-600 hover:text-gray-800">Moje súťaže</a>
          </Link>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </Container>
  )
}
export default AccountLayout
