import { Avatar } from '@components/common'
import { Container, Text, useUI } from '@components/ui'
import { flash } from '@components/ui/FlashMessage'
import { confirm } from '@lib/alerts'
import { setCustomerProfile, useAuthContext } from '@lib/auth'
import { uploadFile } from '@lib/files'
import Image from 'next/image'
import Link from 'next/link'
import React, { ChangeEventHandler, EventHandler, useRef } from 'react'
import { v4 as uuid4 } from 'uuid'

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

  const { customer } = useAuthContext()

  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = () => {
    if (fileRef.current) {
      fileRef.current.click()
    }
  }

  const handleChangeAvatar: ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    const proceed = await confirm('Nahrať nový avatar?')

    if (!proceed) return

    const filename = `${uuid4()}_${file.name}`
    const path = `products/${filename}`

    try {
      const src = await uploadFile(path, file)

      await setCustomerProfile({ ...customer, avatar: src })

      flash('Avatar bude čoskoro nahradeny', 'success')
    } catch (e) {
      console.error(e)
      flash('Nastala chyba, skúste to prosīm znova', 'danger')
    }
  }

  return (
    <Container className="pt-4 mt-0 md:mt-8">
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
        <div className="lg:w-1/3 flex flex-col gap-4 pr-4 pb-8 mx-2 g:mx-4 border-b-[1px] lg:border-r-[1px] border-opacity-70 border-primary items-center justify-center md:justify-start text-lg lg:text-2xl uppercase text-center">
          <div
            className="flex justify-center align-center h-32 w-32"
            onClick={handleFileSelect}
          >
            <input
              className="d-none"
              type="file"
              ref={fileRef}
              onChange={handleChangeAvatar}
            />
            <Avatar />
          </div>
          <Text className="text-xs">(kliknutím zmeníte avatar)</Text>
          <Text variant="pageHeading">{customer.fullname}</Text>
          <div className="flex flex-row lg:flex-col gap-4 justify-center items-center text-lg md:text-xl">
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
        </div>
        <div className="">{children}</div>
      </div>
    </Container>
  )
}
export default AccountLayout
