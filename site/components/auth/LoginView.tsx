import { FC, useEffect, useState, useCallback, FormEventHandler } from 'react'
import { Logo, Button, Input } from '@components/ui'
import { useUI } from '@components/ui/context'
import { validate } from 'email-validator'
import { MIN_PASSWORD_LENGTH } from './SignUpView'
import { signIn, signInVia } from '@lib/auth'
import { useRouter } from 'next/router'
import { flash } from '@components/ui/FlashMessage'
import { StringMap } from '@lib/common-types'
import useLoading from '@lib/hooks/useLoading'

const FlashMessages: StringMap = {
  success: 'Vitajte naspäť, sme radi, že vás tu máme!',
  'auth/user-not-found': 'Email je nesprávny',
  'auth/wrong-password': 'Heslo je nesprávne',
}

const LoginView = () => {
  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setModalView, closeModal } = useUI()

  const router = useRouter()

  const loading = useLoading()

  const handleLogin: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    loading.start()
    signIn(email, password)
      .then(() => {
        flash(FlashMessages.success, 'success')
        closeModal()
      })
      .catch((e) => {
        flash(FlashMessages[e.code] ?? e.message, 'danger')
      })
      .finally(loading.stop)
  }

  const handleFbLogin = () => signInVia('fb')

  return (
    <form
      onSubmit={handleLogin}
      className="w-70 sm:w-80 flex flex-col justify-between p-3"
    >
      <div className="flex justify-center pb-12 ">
        <Logo />
      </div>
      <div className="flex flex-col space-y-3">
        <Input
          variant="form"
          required
          type="email"
          placeholder="Email"
          onChange={setEmail}
          value={email}
        />
        <Input
          variant="form"
          required
          type="password"
          placeholder="Heslo"
          onChange={setPassword}
          value={password}
        />

        <Button
          variant="slim"
          type="submit"
          loading={loading.pending}
          disabled={loading.pending}
        >
          Prihlásiť
        </Button>
        <Button variant="slim" type="button" onClick={handleFbLogin}>
          Prihlásiť cez Facebook
        </Button>
        <div className="pt-1 text-center text-sm">
          <a
            className="text-accent-0 font-bold hover:underline cursor-pointer"
            onClick={() => setModalView('SIGNUP_VIEW')}
          >
            Registrovať
          </a>
        </div>
        <div className="pt-1 text-center text-sm">
          <a
            className="text-accent-0 inline font-bold hover:underline cursor-pointer"
            onClick={() => setModalView('FORGOT_VIEW')}
          >
            Zabudnuté heslo
          </a>
        </div>
      </div>
    </form>
  )
}

export default LoginView
