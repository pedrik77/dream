import { AccountField, AccountFieldWrapper } from '@components/account/Fields'
import { Button, Container, Input, Text, useUI } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { setCustomerProfile, useAuthContext } from '@lib/api/page/auth'
import { useEffect, useState } from 'react'
import { useShopContext } from '@lib/api/shop/context'
import { Checkbox } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { noop } from '@lib/api/page/common'
import Link from '@components/ui/Link'

export default function Information({ onNext = noop, onPrev = noop }) {
  const { customer, isLoggedIn, setCustomer } = useAuthContext()
  const { total } = useShopContext()
  const { setModalView, openModal } = useUI()
  const { t } = useTranslation()

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
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
  const [consent, setConsent] = useState(false)
  const [gdpr, setGdpr] = useState(false)

  useEffect(() => {
    setFirstname(customer.firstname)
    setLastname(customer.lastname)
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

  const loginModal = () => {
    setModalView('LOGIN_VIEW')
    openModal()
  }

  const signUpModal = () => {
    setModalView('SIGNUP_VIEW')
    openModal()
  }

  const handleNext = async () => {
    if (
      !firstname ||
      !lastname ||
      !email ||
      !phone ||
      !street ||
      !city ||
      !zip ||
      !country ||
      !consent ||
      !gdpr
    ) {
      return flash('Vyplňte všetky polia', 'danger')
    }

    if (
      asCompany &&
      (!companyName || !companyBusinessId || !companyTaxId || !companyVatId)
    ) {
      return flash('Vyplňte všetky firemne polia', 'danger')
    }

    const newCustomer = {
      ...customer,
      firstname,
      lastname,
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
    }

    setCustomer(newCustomer)
    await setCustomerProfile(newCustomer).then(onNext).catch(handleErrorFlash)
  }

  return (
    <Container className="col-span-full px-0">
      <div className="flex flex-col sm:flex-row justify-end items-center my-8 gap-4">
        <div className="flex gap-4 text-xl sm:text-2xl font-bold sm:pr-8">
          <span>Spolu:</span>
          <span>{total} €</span>
        </div>
        <div className="flex justify-center sm:justify-end gap-4">
          <Button className="w-36" onClick={onPrev} variant="ghost">
            Späť
          </Button>
          <Button className="w-36 p-0" onClick={handleNext}>
            Prejsť na platbu
          </Button>
        </div>
      </div>
      <Text variant="sectionHeading" className="my-4 pl-2">
        {t('checkout.personal')}
      </Text>
      {!isLoggedIn && false && (
        <div className="flex flex-col align-middle">
          <Button onClick={signUpModal}>Zaregistrovať sa</Button> alebo{' '}
          <Button onClick={loginModal}>Prihlásiť sa</Button>`
        </div>
      )}
      <div className="max-w-3xl my-4 mx-auto px-4">
        <AccountFieldWrapper>
          <div className="flex flex-col col-span-3 sm:divider sm:divide-y">
            <AccountField>
              <label
                htmlFor="firstname"
                className="cursor-pointer pb-4 sm:pb-0"
              >
                Krstné meno *
              </label>
              <Input
                required
                id="firstname"
                variant="ghost"
                value={firstname}
                placeholder="Krstné meno"
                onChange={setFirstname}
              />
            </AccountField>

            <AccountField>
              <label htmlFor="lastname" className="cursor-pointer pb-4 sm:pb-0">
                Priezvisko *
              </label>
              <Input
                required
                id="lastname"
                variant="ghost"
                value={lastname}
                placeholder="Priezvisko"
                onChange={setLastname}
              />
            </AccountField>

            <AccountField>
              <label htmlFor="email" className="cursor-pointer pb-4 sm:pb-0">
                Email *
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
              <label htmlFor="phone" className="cursor-pointer pb-4 sm:pb-0">
                Telefón *
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
      <div className="my-4">
        <Text variant="sectionHeading" className="my-4 pl-2">
          <label>
            {t('checkout.company')}
            <Checkbox
              color="default"
              className="text-primary pr-2 pl-1"
              checked={asCompany}
              onChange={(e) => setAsCompany(e.target.checked)}
            />
          </label>
        </Text>

        {asCompany && (
          <div className="max-w-3xl my-4 mx-auto px-4">
            <AccountFieldWrapper>
              <div className="flex flex-col col-span-3">
                <AccountField>
                  <label
                    htmlFor="companyName"
                    className="cursor-pointer pb-4 sm:pb-0"
                  >
                    Názov spoločnosti *
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
                  <label
                    htmlFor="businessId"
                    className="cursor-pointer pb-4 sm:pb-0"
                  >
                    IČO *
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
                  <label
                    htmlFor="taxId"
                    className="cursor-pointer pb-4 sm:pb-0"
                  >
                    DIČ *
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
                  <label
                    htmlFor="vatId"
                    className="cursor-pointer pb-4 sm:pb-0"
                  >
                    IČ DPH *
                  </label>
                  <Input
                    required
                    id="vatId"
                    variant="ghost"
                    value={companyVatId}
                    placeholder="IČ DPH"
                    onChange={setCompanyVatId}
                  />
                </AccountField>
              </div>
            </AccountFieldWrapper>
          </div>
        )}
      </div>
      <div>
        <Text variant="sectionHeading" className="pl-2 my-8">
          {t('checkout.address')}
        </Text>
        <div className="max-w-3xl my-4 mx-auto px-4">
          <AccountFieldWrapper>
            <div className="flex flex-col col-span-3 divider divide-y">
              <AccountField>
                <label htmlFor="street" className="cursor-pointer pb-4 sm:pb-0">
                  Ulica *
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
                <label htmlFor="city" className="cursor-pointer pb-4 sm:pb-0">
                  Mesto *
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
                <label htmlFor="zip" className="cursor-pointer pb-4 sm:pb-0">
                  PSČ *
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
                <label
                  htmlFor="country"
                  className="cursor-pointer pb-4 sm:pb-0"
                >
                  Krajina *
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

              <AccountField>
                <label
                  htmlFor="consent"
                  className="cursor-pointer pb-4 sm:pb-0"
                >
                  Súhlasím so{' '}
                  <Link
                    href="/vseobecne-obchodne-podmienky"
                    className="underline"
                  >
                    Všeobecnými obchodnými podmienkami
                  </Link>{' '}
                  spoločnosti Vysnivajsi, n.o. *
                </label>
                <Checkbox
                  id="consent"
                  color="default"
                  className="text-primary pr-2 pl-1"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
              </AccountField>

              <AccountField>
                <label htmlFor="gdpr" className="cursor-pointer pb-4 sm:pb-0">
                  Súhlasím s{' '}
                  <Link href="/ochrana-osobnych-udajov" className="underline">
                    Podmienkami spracovania osobných údajov
                  </Link>{' '}
                  spoločnosti Vysnivajsi, n.o. *
                </label>
                <Checkbox
                  id="gdpr"
                  color="default"
                  className="text-primary pr-2 pl-1"
                  checked={gdpr}
                  onChange={(e) => setGdpr(e.target.checked)}
                />
              </AccountField>
            </div>
          </AccountFieldWrapper>
        </div>
      </div>
    </Container>
  )
}
