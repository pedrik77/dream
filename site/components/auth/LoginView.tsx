import { FC, useEffect, useState, useCallback } from 'react'
import { Logo, Button, Input } from '@components/ui'
import { useUI } from '@components/ui/context'
import { validate } from 'email-validator'
import { MIN_PASSWORD_LENGTH } from './SignUpView'
import { signIn } from '@lib/auth'
import { useRouter } from 'next/router'

const LoginView: React.FC = () => {
  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [disabled, setDisabled] = useState(false)
  const { setModalView, closeModal } = useUI()
  const router = useRouter()

  const handleLogin = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()
    setDisabled(true)

    try {
      setLoading(true)
      setMessage('')
      await signIn(email, password)
      setLoading(false)
      closeModal()

      router.push('/account')
    } catch (e: any) {
      setDisabled(false)
      setLoading(false)
      setMessage(e.message)
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="w-80 flex flex-col justify-between p-3"
    >
      <div className="flex justify-center pb-12 ">
        <Logo width="64px" height="64px" />
      </div>
      <div className="flex flex-col space-y-3">
        {message && (
          <div className="text-red border border-red p-3">{message}</div>
        )}
        <Input type="email" placeholder="Email" onChange={setEmail} />
        <Input type="password" placeholder="Password" onChange={setPassword} />

        <Button
          variant="slim"
          type="submit"
          loading={loading}
          disabled={disabled}
        >
          Log In
        </Button>
        <div className="pt-1 text-center text-sm">
          <span className="text-accent-7">Don't have an account?</span>
          {` `}
          <a
            className="text-accent-9 font-bold hover:underline cursor-pointer"
            onClick={() => setModalView('SIGNUP_VIEW')}
          >
            Sign Up
          </a>
        </div>
        <div className="pt-1 text-center text-sm">
          Did you {` `}
          <a
            className="text-accent-9 inline font-bold hover:underline cursor-pointer"
            onClick={() => setModalView('FORGOT_VIEW')}
          >
            forgot your password?
          </a>
        </div>
      </div>
    </form>
  )
}

export default LoginView
