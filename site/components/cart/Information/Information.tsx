import { Input, Text } from '@components/ui'
import { useUser } from '@lib/auth'
import { useShop } from '@lib/shop'
import React, { useState } from 'react'

export default function Information() {
  const { customerData, setCustomerData } = useShop()

  const setFullname = (fullname: string) =>
    setCustomerData({ ...customerData, fullname })
  const setEmail = (email: string) =>
    setCustomerData({ ...customerData, email })
  const setPhone = (phone: string) =>
    setCustomerData({ ...customerData, phone })
  const setStreet = (street: string) =>
    setCustomerData({
      ...customerData,
      address: { ...customerData.address, street },
    })
  const setCity = (city: string) =>
    setCustomerData({
      ...customerData,
      address: { ...customerData.address, city },
    })
  const setZip = (zip: string) =>
    setCustomerData({
      ...customerData,
      address: { ...customerData.address, zip },
    })
  const setCountry = (country: string) =>
    setCustomerData({
      ...customerData,
      address: { ...customerData.address, country },
    })

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
              value={customerData.fullname}
              placeholder="Full name"
              onChange={setFullname}
            />
          </label>
          <label>
            Email{' '}
            <Input
              type="email"
              value={customerData.email}
              placeholder="Email"
              onChange={setEmail}
            />
          </label>
          <label>
            Phone{' '}
            <Input
              type="tel"
              value={customerData.phone}
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
              value={customerData.address.street}
              placeholder="Street"
              onChange={setStreet}
            />
          </label>
          <label>
            City{' '}
            <Input
              type="text"
              value={customerData.address.city}
              placeholder="City"
              onChange={setCity}
            />
          </label>
          <label>
            Zip{' '}
            <Input
              type="text"
              value={customerData.address.zip}
              placeholder="Zip"
              onChange={setZip}
            />
          </label>
          <label>
            Country{' '}
            <Input
              type="text"
              value={customerData.address.country}
              placeholder="Country"
              onChange={setCountry}
            />
          </label>
        </fieldset>
      </div>
    </div>
  )
}
