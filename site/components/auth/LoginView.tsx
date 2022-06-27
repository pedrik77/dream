import { FC, useEffect, useState, useCallback, FormEventHandler } from 'react'
import { Logo, Button, Input } from '@components/ui'
import { useUI } from '@components/ui/context'
import { validate } from 'email-validator'
import { MIN_PASSWORD_LENGTH } from './SignUpView'
import { signIn, signInVia } from '@lib/auth'
import { useRouter } from 'next/router'
import { flash } from '@components/ui/FlashMessage'
import { StringMap } from '@lib/common-types'

const FlashMessages: StringMap = {
  success: 'Vitajte naspäť, sme radi, že vás tu máme!',
  'auth/user-not-found': 'Email je nesprávny',
  'auth/wrong-password': 'Heslo je nesprávne',
}

const LoginView = () => {
  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setModalView, closeModal } = useUI()
  const router = useRouter()

  const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      await signIn(email, password)
      setLoading(false)
      closeModal()
      flash(FlashMessages.success, 'success')
      router.push('/account')
    } catch (e: any) {
      setLoading(false)
      flash(FlashMessages[e.code] ?? e.message, 'danger')
      console.error(e.code)
    }
  }

  const handleFbLogin = () => signInVia('fb')

  return (
    <form
      onSubmit={handleLogin}
      className="w-80 flex flex-col justify-between p-3"
    >
      <div className="flex justify-center pb-12 ">
        <Logo />
      </div>
      <div className="flex flex-col space-y-3">
        <Input required type="email" placeholder="Email" onChange={setEmail} />
        <Input
          required
          type="password"
          placeholder="Heslo"
          onChange={setPassword}
        />

        <Button
          variant="slim"
          type="submit"
          loading={loading}
          disabled={loading}
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
