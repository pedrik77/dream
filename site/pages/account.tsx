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
import { usePermission } from '@lib/hooks/usePermission'

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

    if (!user || !user.email)
      return flash(
        'Nerozpoznány email. Skuste sa odhlasit a prihlasit. V pripade problemov nas kontaktujte.',
        'danger'
      )

    saving.start()

    setCustomerProfile(user.email, {
      email: user.email || '@',
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
          'info',
          7
        )
      })
      .catch(handleErrorFlash)
      .finally(resetMailSending.stop)
  }

  if (!user || !customer) return null

  return (
    <AccountLayout current="account">
      <Text variant="heading">Nastavenie účtu</Text>
      <form onSubmit={save} className="my-8 py-8 flex flex-col gap-4">
        <div className="grid grid-cols-3">
          <Text variant="sectionHeading">Osobné informácie</Text>
          <div className="flex flex-col col-span-2 divide-accent-2 divide-y">
            <div className="flex flex-row items-center space-x-4 py-8">
              <span className="text-md font-medium text-accent-600 flex-1">
                Emailová adresa
              </span>
              <span>{user.email}</span>
            </div>

            <span className="text-md font-medium text-accent-600 flex-1 space-x-4 py-8">
              Pre zmenu vašej mailovej adresy kontaktujte náš tím na adrese
              info@dream.sk
            </span>

            <div className="flex flex-row items-center space-x-4 py-8">
              <span className="text-md font-medium text-accent-600 flex-1">
                Celé meno
              </span>
              <Input value={fullname} onChange={setFullname} />
            </div>

            <div className="flex flex-row items-center space-x-4 py-8">
              <span className="text-md font-medium text-accent-600 flex-1">
                Telefónne číslo
              </span>
              <Input value={phone} onChange={setPhone} type="tel" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3">
          <Text variant="sectionHeading">Adresa</Text>
          <div className="flex flex-col col-span-2 divide-accent-2 divide-y">
            <div className="flex flex-row items-center space-x-4 py-8">
              <span className="text-lg font-medium text-accent-600 flex-1">
                Ulica
              </span>
              <Input value={street} onChange={setStreet} />
            </div>

            <div className="flex flex-row items-center space-x-4 py-4">
              <span className="text-lg font-medium text-accent-600 flex-1">
                Mesto
              </span>
              <Input value={city} onChange={setCity} />
            </div>

            <div className="flex flex-row items-center space-x-4 py-4">
              <span className="text-lg font-medium text-accent-600 flex-1">
                Krajina
              </span>
              <Input
                value={country}
                onChange={setCountry}
                className="bg-transparent"
              />
            </div>

            <div className="flex flex-row items-center space-x-4 py-4">
              <span className="text-lg font-medium text-accent-600 flex-1">
                PSČ
              </span>
              <Input value={zip} onChange={setZip} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3">
          <Text variant="sectionHeading">Prihlasovanie a bezpečnosť</Text>
          <div className="flex flex-col col-span-2 divide-accent-2 divide-y">
            <div className="flex flex-row items-center space-x-4 py-4">
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
        </div>
        <Button className="w-40 self-center my-16" disabled={saving.pending}>
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
