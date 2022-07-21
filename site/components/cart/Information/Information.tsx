import { AccountField, AccountFieldWrapper } from '@components/account/Fields'
import { Button, Input, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import { useAuth } from '@lib/auth'
import { useShop } from '@lib/shop'
import React, { useEffect, useState } from 'react'

export default function Information() {
  const { customer, isLoggedIn } = useAuth()

  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('')

  useEffect(() => {
    setFullname(customer.fullname)
    setEmail(customer.email)
    setPhone(customer.phone)
    setStreet(customer.address.street)
    setCity(customer.address.city)
    setZip(customer.address.zip)
    setCountry(customer.address.country)
  }, [customer])

  const { setModalView, openModal } = useUI()

  const loginModal = () => {
    setModalView('LOGIN_VIEW')
    openModal()
  }

  const signUpModal = () => {
    setModalView('SIGNUP_VIEW')
    openModal()
  }

  return (
    <div>
      {!isLoggedIn && (
        <div className="flex flex-col align-middle">
          <Button onClick={signUpModal}>Je libo registrovat?</Button> abo{' '}
          <Button onClick={loginModal}>Je libo rovno prihlasit?</Button>`
        </div>
      )}
      <Text variant="sectionHeading" className="my-4">
        Personal Informacie
      </Text>
      <div className="max-w-3xl my-4 mx-auto">
        <AccountFieldWrapper>
          <div className="flex flex-col col-span-3 divider divide-y">
            <AccountField>
              <label htmlFor="fullname" className="cursor-pointer">
                Celé meno
              </label>
              <Input
                id="fullname"
                variant="ghost"
                value={fullname}
                placeholder="Celé meno"
                onChange={setFullname}
              />
            </AccountField>
            <AccountField>
              <label htmlFor="email" className="cursor-pointer">
                Email{' '}
              </label>
              <Input
                id="email"
                type="email"
                variant="ghost"
                value={email}
                placeholder="Email"
                onChange={setEmail}
              />
            </AccountField>

            <AccountField>
              <label htmlFor="phone" className="cursor-pointer">
                Phone{' '}
              </label>
              <Input
                id="phone"
                type="tel"
                variant="ghost"
                value={phone}
                placeholder="Phone"
                onChange={setPhone}
              />
            </AccountField>
          </div>
        </AccountFieldWrapper>
      </div>
      <div>
        <Text variant="sectionHeading" className="my-4">
          Adresne Informacie
        </Text>
        <div className="max-w-3xl my-4 mx-auto">
          <AccountFieldWrapper>
            <div className="flex flex-col col-span-3 divider divide-y">
              <AccountField>
                <label htmlFor="street" className="cursor-pointer">
                  Street{' '}
                </label>
                <Input
                  id="street"
                  type="text"
                  variant="ghost"
                  value={street}
                  placeholder="Street"
                  onChange={setStreet}
                />
              </AccountField>
              <AccountField>
                <label htmlFor="city" className="cursor-pointer">
                  City{' '}
                </label>
                <Input
                  id="city"
                  type="text"
                  variant="ghost"
                  value={city}
                  placeholder="City"
                  onChange={setCity}
                />
              </AccountField>

              <AccountField>
                <label htmlFor="zip" className="cursor-pointer">
                  Zip{' '}
                </label>
                <Input
                  id="zip"
                  type="text"
                  variant="ghost"
                  value={zip}
                  placeholder="Zip"
                  onChange={setZip}
                />
              </AccountField>

              <AccountField>
                <label htmlFor="country" className="cursor-pointer">
                  Country{' '}
                </label>
                <Input
                  id="country"
                  type="text"
                  variant="ghost"
                  value={country}
                  placeholder="Country"
                  onChange={setCountry}
                />
              </AccountField>
            </div>
          </AccountFieldWrapper>
        </div>
      </div>
    </div>
  )
}
