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
        Informacie
      </Text>
      <div>
        <fieldset className="flex">
          <label>
            Full name{' '}
            <Input
              type="text"
              value={fullname}
              placeholder="Full name"
              onChange={setFullname}
            />
          </label>
          <label>
            Email{' '}
            <Input
              type="email"
              value={email}
              placeholder="Email"
              onChange={setEmail}
            />
          </label>
          <label>
            Phone{' '}
            <Input
              type="tel"
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
              value={street}
              placeholder="Street"
              onChange={setStreet}
            />
          </label>
          <label>
            City{' '}
            <Input
              type="text"
              value={city}
              placeholder="City"
              onChange={setCity}
            />
          </label>
          <label>
            Zip{' '}
            <Input
              type="text"
              value={zip}
              placeholder="Zip"
              onChange={setZip}
            />
          </label>
          <label>
            Country{' '}
            <Input
              type="text"
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
