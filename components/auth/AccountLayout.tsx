import { Avatar } from '@components/common'
import Permit from '@components/common/Permit'
import { Container, Text, useUI } from '@components/ui'
import { flash } from '@components/ui/FlashMessage'
import { confirm } from '@lib/alerts'
import { setCustomerProfile, useAuthContext } from '@lib/auth'
import { uploadFile } from '@lib/files'
import Image from 'next/image'
import Link from 'next/link'
import React, { ChangeEventHandler, EventHandler, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import s from './AccountLayout.module.css'

const LINKS = {
  prizes: 'Moje súťaže',
  orders: 'Moje objednávky',
  account: 'Nastavenie účtu',
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

  const { t } = useTranslation()

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

    flash('Nahrávam avatar...', 'info')

    const path = `avatar/${customer.email}`

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
    <Permit redirect="/">
      <Container className="pt-4 mt-0 md:mt-8">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-6">
          <div className="lg:w-1/3 flex flex-col gap-4 sm:pr-4 pb-8 mx-2 lg:mx-4 items-center justify-center md:justify-start text-lg lg:text-2xl uppercase text-center">
            <div
              className="flex justify-center align-center h-32 w-32 cursor-pointer"
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
            <span className="text-sm">({t('account.changeAvatar')})</span>
            <Text variant="pageHeading">
              {customer.firstname} {customer.lastname}
            </Text>
            <div className="flex flex-row lg:flex-col gap-4 justify-center items-center text-[1rem] sm:text-lg md:text-xl">
              {tuples.map(([href, label]) => (
                <Link key={href} href={'/' + href}>
                  <a
                    title={label}
                    className={`${s.link} ${current === href ? s.active : ''}`}
                  >
                    {label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <div className="w-full">{children}</div>
        </div>
      </Container>
    </Permit>
  )
}
export default AccountLayout
