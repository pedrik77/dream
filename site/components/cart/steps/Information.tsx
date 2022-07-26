import { AccountField, AccountFieldWrapper } from '@components/account/Fields'
import { Button, Input, Text } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { setCustomerProfile, useAuthContext } from '@lib/auth'
import { useEffect, useState } from 'react'

export default function Information({ onNext = () => {}, onPrev = () => {} }) {
  const { customer, isLoggedIn } = useAuthContext()

  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('')

  const [companyName, setCompanyName] = useState('')
  const [companyBusinessId, setCompanyBusinessId] = useState('')
  const [companyTaxId, setCompanyTaxId] = useState('')
  const [companyVatId, setCompanyVatId] = useState('')

  const [asCompany, setAsCompany] = useState(false)

  useEffect(() => {
    setFullname(customer.fullname)
    setEmail(customer.email)
    setPhone(customer.phone)

    setStreet(customer.address.street)
    setCity(customer.address.city)
    setZip(customer.address.zip)
    setCountry(customer.address.country)

    setCompanyName(customer.company?.name || '')
    setCompanyBusinessId(customer.company?.business_id || '')
    setCompanyTaxId(customer.company?.tax_id || '')
    setCompanyVatId(customer.company?.vat_id || '')
  }, [customer])

  const handleNext = async () => {
    if (!fullname || !email || !phone || !street || !city || !zip || !country) {
      return flash('Vyplňte všetky polia', 'danger')
    }

    if (
      asCompany &&
      (!companyName || !companyBusinessId || !companyTaxId || !companyVatId)
    ) {
      return flash('Vyplňte všetky firemne polia', 'danger')
    }

    await setCustomerProfile({
      ...customer,
      fullname,
      email,
      phone,
      address: {
        street,
        city,
        zip,
        country,
      },
      company: {
        name: companyName,
        business_id: companyBusinessId,
        tax_id: companyTaxId,
        vat_id: companyVatId,
      },
    })

    onNext()
  }

  return (
    <div>
      <div className="flex justify-end items-center my-8 gap-4">
        <a href="#" onClick={onPrev} className="underline">
          Spat
        </a>
        <Button className="w-36" onClick={handleNext}>
          Pokracovat
        </Button>
      </div>
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
                required
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
                required
                id="email"
                type="email"
                variant="ghost"
                value={email}
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
                required
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
          <label>
            Firemne udaje (kupujem na firmu{' '}
            <input
              type="checkbox"
              checked={asCompany}
              onChange={(e) => setAsCompany(e.target.checked)}
            />
          </label>
          )
        </Text>

        {asCompany ? (
          <div className="max-w-3xl my-4 mx-auto">
            <AccountFieldWrapper>
              <div className="flex flex-col col-span-3 divider divide-y">
                <AccountField>
                  <label htmlFor="fullname" className="cursor-pointer">
                    Názov spoločnosti
                  </label>
                  <Input
                    required
                    id="companyName"
                    variant="ghost"
                    value={companyName}
                    placeholder="Názov spoločnosti"
                    onChange={setCompanyName}
                  />
                </AccountField>
                <AccountField>
                  <label htmlFor="fullname" className="cursor-pointer">
                    IČO
                  </label>
                  <Input
                    required
                    id="businessId"
                    variant="ghost"
                    value={companyBusinessId}
                    placeholder="IČO"
                    onChange={setCompanyBusinessId}
                  />
                </AccountField>
                <AccountField>
                  <label htmlFor="fullname" className="cursor-pointer">
                    DIČ
                  </label>
                  <Input
                    required
                    id="taxId"
                    variant="ghost"
                    value={companyTaxId}
                    placeholder="DIČ"
                    onChange={setCompanyTaxId}
                  />
                </AccountField>
                <AccountField>
                  <label htmlFor="fullname" className="cursor-pointer">
                    DIČ
                  </label>
                  <Input
                    required
                    id="vatId"
                    variant="ghost"
                    value={companyVatId}
                    placeholder="DIČ"
                    onChange={setCompanyVatId}
                  />
                </AccountField>
              </div>
            </AccountFieldWrapper>
          </div>
        ) : (
          'Máte záujem nakúpit na firmu?'
        )}
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
                  required
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
                  required
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
                  required
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
                  required
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
