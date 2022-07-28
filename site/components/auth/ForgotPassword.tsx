import { FC, useEffect, useState, useCallback } from 'react'
import { validate } from 'email-validator'
import { useUI } from '@components/ui/context'
import { Logo, Button, Input } from '@components/ui'
import { resetPassword } from '@lib/auth'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import useLoading from '@lib/hooks/useLoading'

interface Props {}

const ForgotPassword: FC<Props> = () => {
  // Form State
  const [email, setEmail] = useState('')

  const loading = useLoading()

  const { setModalView, closeModal } = useUI()

  const handleResetPassword = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()
    loading.start()

    resetPassword(email)
      .then(() => {
        flash('Email bol odoslaný na zadanú adresu.')
        closeModal()
      })
      .catch(handleErrorFlash)
      .finally(loading.stop)
  }

  return (
    <form
      onSubmit={handleResetPassword}
      className="w-80 flex flex-col justify-between p-3"
    >
      <div className="flex justify-center pb-12 ">
        <Logo />
      </div>
      <div className="flex flex-col space-y-4">
        <div className="py-3 text-accent-0">
          Prosím zadajte vašu e-mailovú adresu. Pošleme vám e-mail na
          resetovanie vášho hesla.
        </div>

        <Input
          placeholder="Email"
          onChange={setEmail}
          type="email"
          value={email}
        />
        <div className="pt-2 w-full flex flex-col">
          <Button
            variant="slim"
            type="submit"
            loading={loading.pending}
            disabled={loading.pending}
          >
            Odoslať
          </Button>
        </div>

        <span className="pt-3 text-center text-sm">
          <a
            className="text-accent-0 font-bold hover:underline cursor-pointer"
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
