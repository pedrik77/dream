import { Layout } from '@components/common'
import { Text, Input, Button } from '@components/ui'
import { useAuthContext, setCustomerProfile, resetPassword } from '@lib/auth'
import React, {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import AccountLayout from '@components/auth/AccountLayout'
import useLoading from '@lib/hooks/useLoading'
import { AccountField, AccountFieldWrapper } from '@components/account/Fields'
import { Label } from '@radix-ui/react-dropdown-menu'
import { confirm } from '@lib/alerts'
import { useTranslation } from 'react-i18next'

export default function Account() {
  const { customer } = useAuthContext()
  const { t } = useTranslation()

  const [fullname, setFullname] = useState('')
  const [phone, setPhone] = useState('')

  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [zip, setZip] = useState('')

  const saving = useLoading()
  const resetMailSending = useLoading()

  useEffect(() => {
    setFullname(customer.fullname)
    setPhone(customer.phone)

    setStreet(customer.address.street)
    setCity(customer.address.city)
    setCountry(customer.address.country)
    setZip(customer.address.zip)
  }, [customer])

  const save: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    if (!customer.email)
      return flash(
        'Nerozpoznány email. Skuste sa odhlasit a prihlasit. V pripade problemov nas kontaktujte.',
        'danger'
      )

    saving.start()

    setCustomerProfile({
      ...customer,
      email: customer.email || '@',
      fullname,
      phone,
      address: {
        street,
        city,
        country,
        zip,
      },
    })
      .then(() => {
        flash('Údaje uložené')
        saving.stop()
      })
      .catch(handleErrorFlash)
      .finally(saving.stop)
  }

  const sendResetEmail: MouseEventHandler = (e) => {
    e.preventDefault()

    if (!customer.email) return

    resetMailSending.start()

    resetPassword(customer.email)
      .then(() => {
        flash(
          ({ deleteFlash }) => (
            <span>
              Poslali sme mail na {customer.email}. Kliknite na link v maile pre
              dokončenie zmeny Vášho hesla. Neprišiel vám e-mail?{' '}
              <a
                href="#"
                onClick={(e) => {
                  deleteFlash()
                  sendResetEmail(e)
                }}
                className="text-bold"
              >
                Poslať znova
              </a>
            </span>
          ),
          'info',
          7
        )
      })
      .catch(handleErrorFlash)
      .finally(resetMailSending.stop)
  }

  if (!customer) return null

  return (
    <AccountLayout current="account">
      <Text variant="heading" className="mt-0 md:mt-8">
        Nastavenie účtu
      </Text>
      <form
        onSubmit={save}
        className="my-4 md:my-8 py-4 md:py-8 flex flex-col gap-8"
      >
        <AccountFieldWrapper>
          <Text variant="sectionHeading">Osobné informácie</Text>
          <div className="flex flex-col md:col-span-2 divide-y">
            <AccountField>
              <Label className="mb-2">Emailová adresa</Label>
              <span className="text-lg">{customer.email}</span>
            </AccountField>

            <span className="text-md font-medium text-accent-600 flex-1 space-x-4 py-8">
              Pre zmenu vašej mailovej adresy kontaktujte náš tím na adrese{' '}
              {t('account.contactEmail')}
            </span>

            <AccountField>
              <label htmlFor="fullname" className="cursor-pointer mb-2">
                Celé meno
              </label>
              <Input
                id="fullname"
                variant="ghost"
                value={fullname}
                onChange={setFullname}
              />
            </AccountField>

            <AccountField>
              <label htmlFor="phone" className="cursor-pointer mb-2">
                Telefónne číslo
              </label>
              <Input
                id="phone"
                variant="ghost"
                value={phone}
                onChange={setPhone}
                type="tel"
              />
            </AccountField>
          </div>
        </AccountFieldWrapper>
        <AccountFieldWrapper>
          <Text variant="sectionHeading">Adresa</Text>
          <div className="flex flex-col col-span-2 divide-y">
            <AccountField>
              <label htmlFor="street" className="cursor-pointer mb-2">
                Ulica
              </label>
              <Input
                id="street"
                variant="ghost"
                value={street}
                onChange={setStreet}
              />
            </AccountField>

            <AccountField>
              <label htmlFor="city" className="cursor-pointer mb-2">
                Mesto
              </label>
              <Input
                id="city"
                variant="ghost"
                value={city}
                onChange={setCity}
              />
            </AccountField>

            <AccountField>
              <label htmlFor="country" className="cursor-pointer  mb-2">
                Krajina
              </label>
              <Input
                id="country"
                variant="ghost"
                value={country}
                onChange={setCountry}
              />
            </AccountField>

            <AccountField>
              <label htmlFor="zip" className="cursor-pointer  mb-2">
                PSČ
              </label>
              <Input id="zip" variant="ghost" value={zip} onChange={setZip} />
            </AccountField>
          </div>
        </AccountFieldWrapper>
        <AccountFieldWrapper>
          <Text variant="sectionHeading">Prihlasovanie a bezpečnosť</Text>
          <div className="flex flex-col col-span-2 divide-y border-opacity-50">
            <div className="flex flex-row justify-end py-4 sm:py-10 font-bold">
              <Button
                disabled={resetMailSending.pending}
                type="button"
                variant="ghost"
                onClick={(e) =>
                  confirm('Naozaj?').then(
                    (confirmed) => confirmed && sendResetEmail(e)
                  )
                }
              >
                Zmeniť heslo
              </Button>
            </div>
          </div>
        </AccountFieldWrapper>
        <Button className="w-40 self-center md:my-16" disabled={saving.pending}>
          {saving.pending ? 'Ukladám' : 'Uložiť'}
        </Button>
      </form>
    </AccountLayout>
  )
}

Account.Layout = Layout
