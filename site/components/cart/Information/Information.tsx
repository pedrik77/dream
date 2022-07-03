import { AccountField } from '@components/account/Fields'
import { Input, Text } from '@components/ui'
import { useUser } from '@lib/auth'
import { useShop } from '@lib/shop'
import React, { useEffect, useState } from 'react'

export default function Information() {
  const { customer } = useUser()

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

  return (
    <div>
      <Text variant="sectionHeading" className="my-4">
        Personal Informacie
      </Text>
      <div className="max-w-3xl my-8 mx-auto">
        <fieldset className="flex flex-col gap-8 justify-center">
          <AccountField>
            <label htmlFor="fullname" className="cursor-pointer">
              Celé meno
            </label>
            <Input
              id="fullname"
              variant="ghost"
              value={fullname}
              onChange={setFullname}
            />
          </AccountField>
          <label>
            Email{' '}
            <Input
              type="email"
              variant="ghost"
              value={email}
              placeholder="Email"
              onChange={setEmail}
            />
          </label>
          <label>
            Phone{' '}
            <Input
              type="tel"
              variant="ghost"
              value={phone}
              placeholder="Phone"
              onChange={setPhone}
            />
          </label>
        </fieldset>
        <fieldset className="flex">
          <label>
            Street{' '}
            <Input
              type="text"
              variant="ghost"
              value={street}
              placeholder="Street"
              onChange={setStreet}
            />
          </label>
          <label>
            City{' '}
            <Input
              type="text"
              variant="ghost"
              value={city}
              placeholder="City"
              onChange={setCity}
            />
          </label>
          <label>
            Zip{' '}
            <Input
              type="text"
              variant="ghost"
              value={zip}
              placeholder="Zip"
              onChange={setZip}
            />
          </label>
          <label>
            Country{' '}
            <Input
              type="text"
              variant="ghost"
              value={country}
              placeholder="Country"
              onChange={setCountry}
            />
          </label>
        </fieldset>
      </div>
    </div>
  )
}
