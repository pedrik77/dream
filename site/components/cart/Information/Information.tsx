import { Input, Text } from '@components/ui'
import { useUser } from '@lib/auth'
import React, { useState } from 'react'

export default function Information() {
  const { user, customer } = useUser()

  const [fullname, setFullname] = useState(customer.fullname)
  const [email, setEmail] = useState(user?.email || '@')
  const [phone, setPhone] = useState(customer.phone)
  const [street, setStreet] = useState(customer.address.street)
  const [city, setCity] = useState(customer.address.city)
  const [zip, setZip] = useState(customer.address.zip)
  const [country, setCountry] = useState(customer.address.country)

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
      </div>
    </div>
  )
}
