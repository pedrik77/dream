import { flash } from '@components/ui/FlashMessage'
import { subscribe } from '@lib/newsletter'
import { Button } from '@mui/material'
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
      })
      .catch((e) => {
        console.log(e)

        flash('oh nou')
      })
  }

  return (
    <div className="bg-dark">
      <h3>
        <span className="text-white">Newsletter </span>
      </h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          placeholder={'Email'}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit">Prihlásiť</Button>
      </form>
    </div>
  )
}
