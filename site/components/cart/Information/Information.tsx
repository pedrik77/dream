import { AccountField, AccountFieldWrapper } from '@components/account/Fields'
import { Input, Text } from '@components/ui'
import { useUser } from '@lib/auth'
import { useShop } from '@lib/shop'
import { ExpectClosure } from '@lib/types'

export default function Information() {
  const { customer, setCustomer, isLoggedIn } = useUser()

  const setFullname = (fullname: string) => {}
  const setEmail = (email: string) => {}
  const setPhone = (phone: string) => {}
  const setStreet = (street: string) => {}
  const setCity = (city: string) => {}
  const setZip = (zip: string) => {}
  const setCountry = (country: string) => {}

  return (
    <div>
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
                value={customer.fullname}
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
                value={customer.email}
                placeholder="Email"
                onChange={setEmail}
                disabled={isLoggedIn}
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
                value={customer.phone}
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
                  value={customer.address.street}
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
                  value={customer.address.city}
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
                  value={customer.address.zip}
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
                  value={customer.address.country}
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
