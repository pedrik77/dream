import { Button, Input } from '@components/ui'
import { flash } from '@components/ui/FlashMessage'
import { subscribe } from '@lib/newsletter'
import React, { FormEventHandler, useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log('submit', e)
    subscribe(email)
      .then((result) => {
        console.log({ result })
        flash('Skvelé, vaše prihlásenie prebehlo úspešne!')
        setEmail('')
      })
      .catch((e) => {
        console.log(e)

        flash('oh nou')
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="flex">
        <Input
          type="text"
          value={email}
          placeholder="Newsletter"
          onChange={setEmail}
        />
        <Button type="submit">Prihlásiť</Button>
      </fieldset>
    </form>
  )
}
