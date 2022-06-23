import { Button, Input } from '@components/ui'
import { flash } from '@components/ui/FlashMessage'
import { subscribe } from '@lib/newsletter'
import { Checkbox } from '@mui/material'
import React, { FormEventHandler, useState } from 'react'
import s from './Newsletter.module.css'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [gdprChecked, setGdprChecked] = useState(false)

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log('submit', e)

    subscribe(email, gdprChecked)
      .then((result) => {
        console.log({ result })
        flash('Skvelé, vaše prihlásenie prebehlo úspešne!')
        setEmail('')
        setGdprChecked(false)
      })
      .catch((e) => {
        flash(e.message, 'danger')
      })
  }

  return (
    <>
      <h3>PRIHLÁSENIE DO ODBERU NOVINIEK</h3>
      <form onSubmit={handleSubmit}>
        <fieldset className={s.main}>
          <Input
            type="text"
            value={email}
            placeholder="Zadajte váš email"
            onChange={setEmail}
            className={s.input}
          />

          <Button className={s.button} type="submit">
            Prihlásiť
          </Button>
        </fieldset>
        <fieldset className={s.gdpr}>
          <Checkbox
            className={s.checkbox}
            checked={gdprChecked}
            onChange={(e) => setGdprChecked(!!e.target.checked)}
          />
          <p className={s.text}>
            Wafer sweet bonbon dessert cupcake. Muffin apple pie candy oat cake
            liquorice brownie tart. Tiramisu chocolate cake apple pie muffin
            chocolate bar gummi bears sugar plum.
          </p>
        </fieldset>
      </form>
    </>
  )
}
