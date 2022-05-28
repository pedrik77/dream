import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Container, Text, Input, Button } from '@components/ui'
import { useUser, setCustomerProfile, resetPassword } from '@lib/auth'
import { useEffect, useState } from 'react'
import { flash } from '@components/ui/FlashMessage'

export default function Account() {
  const { user, customer } = useUser()

  const [fullname, setFullname] = useState('')
  const [phone, setPhone] = useState('')

  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [zip, setZip] = useState('')

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!customer) return

    setFullname(customer.fullname)
    setPhone(customer.phone)

    setStreet(customer.address.street)
    setCity(customer.address.city)
    setCountry(customer.address.country)
    setZip(customer.address.zip)
  }, [user, customer])

  const save = async (e) => {
    e.preventDefault()

    setSaving(true)

    await setCustomerProfile(user.uid, {
      fullname,
      phone,
      address: {
        street,
        city,
        country,
        zip,
      },
    })

    setSaving(false)
  }

  const sendResetEmail = async (e) => {
    e.preventDefault()

    await resetPassword(user.email)
    flash(
      <>
        Poslali sme mail na tulic.peter77@gmail.com. Kliknite na link v maile
        pre dokončenie zmeny Vášho hesla. Neprišiel vám e-mail?{' '}
        <a href="#" onClick={sendResetEmail} className="text-bold">
          Poslať znova
        </a>
      </>,
      'info',
      15
    )
  }

  if (!user || !customer) return null

  return (
    <Container className="pt-4">
      <Text variant="pageHeading">Nastavenie účtu</Text>
      <form onSubmit={save}>
        <div className="grid grid-cols-2">
          <Text variant="sectionHeading">Osobné informácie</Text>
          <div className="flex flex-col divide-accent-2 divide-y">
            <div className="flex flex-row items-center space-x-4 py-4">
              <span className="text-lg font-medium text-accent-600 flex-1">
                Emailová adresa
              </span>
              <span>{user.email}</span>
            </div>

            <span>
              Pre zmenu vašej mailovej adresy kontaktujte náš tím na adrese
              info@dream.sk
            </span>

            <div className="flex flex-row items-center space-x-4 py-4">
              <span className="text-lg font-medium text-accent-600 flex-1">
                Celé meno
              </span>
              <Input value={fullname} onChange={setFullname} />
            </div>

            <div className="flex flex-row items-center space-x-4 py-4">
              <span className="text-lg font-medium text-accent-600 flex-1">
                Telefónne číslo
              </span>
              <Input value={phone} onChange={setPhone} type="tel" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <Text variant="sectionHeading">Adresa</Text>
          <div className="flex flex-col divide-accent-2 divide-y">
            <div className="flex flex-row items-center space-x-4 py-4">
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
              <Input value={country} onChange={setCountry} />
            </div>

            <div className="flex flex-row items-center space-x-4 py-4">
              <span className="text-lg font-medium text-accent-600 flex-1">
                PSČ
              </span>
              <Input value={zip} onChange={setZip} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <Text variant="sectionHeading">Prihlasovanie a bezpečnosť</Text>
          <div className="flex flex-col divide-accent-2 divide-y">
            <div className="flex flex-row items-center space-x-4 py-4">
              <Button type="button" onClick={sendResetEmail}>
                Zmeniť heslo
              </Button>
            </div>
          </div>
        </div>
        <Button disabled={saving}>{saving ? 'Ukladám' : 'Uložiť'}</Button>
      </form>
    </Container>
  )
}

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
