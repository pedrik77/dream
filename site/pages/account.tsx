import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Container, Text, Input, Button } from '@components/ui'
import { useUser, setCustomerProfile, resetPassword } from '@lib/auth'
import React, {
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import Link from 'next/link'
import AccountLayout from '@components/auth/AccountLayout'
import useLoading from '@lib/hooks/useLoading'
import { AccountField, AccountFieldWrapper } from '@components/account/Fields'
import { Label } from '@radix-ui/react-dropdown-menu'

export default function Account() {
  const { user, customer } = useUser()

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
  }, [user, customer])

  const save: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    if (!user) return

    saving.start()

    setCustomerProfile(user.uid, {
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

    if (!user || !user.email) return

    resetMailSending.start()

    resetPassword(user.email)
      .then(() => {
        flash(
          ({ deleteFlash }) => (
            <>
              Poslali sme mail na {user.email}. Kliknite na link v maile pre
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
            </>
          ),
          'info'
        )
      })
      .catch(handleErrorFlash)
      .finally(resetMailSending.stop)
  }

  if (!user || !customer) return null

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
          <div className="flex flex-col md:col-span-2 divide-secondary divide-y">
            <AccountField>
              <Label>Emailová adresa</Label>
              <span>{user.email}</span>
            </AccountField>

            <span className="text-md font-medium text-accent-600 flex-1 space-x-4 py-8">
              Pre zmenu vašej mailovej adresy kontaktujte náš tím na adrese
              info@dream.sk
            </span>

            <AccountField>
              <Label>Celé meno</Label>
              <Input variant="ghost" value={fullname} onChange={setFullname} />
            </AccountField>

            <AccountField>
              <Label>Telefónne číslo</Label>
              <Input
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
          <div className="flex flex-col col-span-2 divide-secondary divide-y">
            <AccountField>
              <Label>Ulica</Label>
              <Input variant="ghost" value={street} onChange={setStreet} />
            </AccountField>

            <AccountField>
              <Label>Mesto</Label>
              <Input variant="ghost" value={city} onChange={setCity} />
            </AccountField>

            <AccountField>
              <Label>Krajina</Label>
              <Input variant="ghost" value={country} onChange={setCountry} />
            </AccountField>

            <AccountField>
              <Label>PSČ</Label>
              <Input variant="ghost" value={zip} onChange={setZip} />
            </AccountField>
          </div>
        </AccountFieldWrapper>
        <AccountFieldWrapper>
          <Text variant="sectionHeading">Prihlasovanie a bezpečnosť</Text>
          <div className="flex flex-col col-span-2 divide-primary divide-y border-opacity-50">
            <div className="flex flex-row justify-end space-x-4 py-10 font-bold">
              <Button
                disabled={resetMailSending.pending}
                type="button"
                variant="ghost"
                onClick={(e) => confirm('Naozaj?') && sendResetEmail(e)}
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

// @ts-ignore
export async function getStaticProps({ preview, locale, locales }) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise

  return {
    props: { pages, categories },
  }
}

Account.Layout = Layout
