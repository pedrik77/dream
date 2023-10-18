import { Button, Input } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { subscribe } from '@lib/newsletter'
import { Checkbox } from '@mui/material'
import React, { FormEventHandler, useState } from 'react'
import { useTranslation } from 'react-i18next'
import s from './Newsletter.module.css'
import Link from '@components/ui/Link'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [gdprChecked, setGdprChecked] = useState(false)

  const [isSubmitting, setSubmitting] = useState(false)

  const { t } = useTranslation()

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log('submit', e)

    subscribe(email, gdprChecked)
      .then((result) => {
        flash('Skvelé, vaše prihlásenie prebehlo úspešne!', 'success')
        setEmail('')
        setGdprChecked(false)
      })
      .catch(handleErrorFlash)
      .finally(() => setSubmitting(false))
  }

  return (
    <>
      <h3 className="font-bold lg:text-right">
        PRIHLÁSENIE DO ODBERU NOVINIEK
      </h3>
      <form onSubmit={handleSubmit}>
        <fieldset className={s.main}>
          <Input
            type="text"
            value={email}
            placeholder="Zadajte váš email"
            onChange={setEmail}
            className={s.input}
          />

          <Button disabled={isSubmitting} className={s.button} type="submit">
            Prihlásiť
          </Button>
        </fieldset>
        <fieldset className={s.gdpr}>
          <Checkbox
            id="gdpr-checkbox"
            checked={gdprChecked}
            onChange={(e) => setGdprChecked(!!e.target.checked)}
            color="default"
            className="mr-2 lg:mr-0 text-white py-0 pl-0 items-start"
            size="small"
          />

          <label htmlFor="gdpr-checkbox" className={s.text}>
            <Link href="/ochrana-osobnych-udajov">
              {t('footer.newsletter')}
            </Link>
          </label>
        </fieldset>
      </form>
    </>
  )
}
