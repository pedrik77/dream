import { FC, useEffect, useState, useCallback } from 'react'
import { validate } from 'email-validator'
import { useUI } from '@components/ui/context'
import { Logo, Button, Input } from '@components/ui'
import { resetPassword } from '@lib/auth'
import { flash } from '@components/ui/FlashMessage'

interface Props {}

const ForgotPassword: FC<Props> = () => {
  // Form State
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const { setModalView, closeModal } = useUI()

  const handleResetPassword = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()

    await resetPassword(email)
    setLoading(true)
    flash('Email bol odoslaný na zadanú adresu.')
  }

  return (
    <form
      onSubmit={handleResetPassword}
      className="w-80 flex flex-col justify-between p-3"
    >
      <div className="flex justify-center pb-12 ">
        <Logo width="64px" height="64px" />
      </div>
      <div className="flex flex-col space-y-4">
        <div className="p-3">
          Prosím zadajte vašu e-mailovú adresu. Pošleme vám e-mail na
          resetovanie vášho hesla.
        </div>

        <Input placeholder="Email" onChange={setEmail} type="email" />
        <div className="pt-2 w-full flex flex-col">
          <Button
            variant="slim"
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Odoslať
          </Button>
        </div>

        <span className="pt-3 text-center text-sm">
          <a
            className="text-accent-9 font-bold hover:underline cursor-pointer"
            onClick={() => setModalView('LOGIN_VIEW')}
          >
            Prihlásiť sa
          </a>
        </span>
      </div>
    </form>
  )
}

export default ForgotPassword
