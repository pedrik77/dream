import { FC, useState } from 'react'
import { Info } from '@components/icons'
import { useUI } from '@components/ui/context'
import { Logo, Button, Input } from '@components/ui'
import { signUp } from '@lib/auth'
import { useRouter } from 'next/router'

export const MIN_PASSWORD_LENGTH = 8

interface Props {}

// const FlashMessages = {
//   success: 'Vitajte naspäť, sme radi, že vás tu máme!',
//   'auth/user-not-found': 'Email je nesprávny',
//   'auth/wrong-password': 'Heslo je nesprávne',
// }

const SignUpView: FC<Props> = () => {
  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const { setModalView, closeModal } = useUI()

  const handleSignup = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()

    try {
      setLoading(true)
      // setMessage('')
      await signUp(email, password, newsletter)
      setLoading(false)
      closeModal()

      router.push('/account')
    } catch (e: any) {
      // setMessage(e.message)
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSignup}
      className="w-80 flex flex-col justify-between p-3"
    >
      <div className="flex justify-center pb-12 ">
        <Logo width="64px" height="64px" />
      </div>
      <div className="flex flex-col space-y-4">
        <Input type="email" placeholder="Email" onChange={setEmail} />
        <Input type="password" placeholder="Password" onChange={setPassword} />
        <label>
          <input
            type="checkbox"
            onChange={(e) => setNewsletter(e.target.checked)}
          />{' '}
          Newsletter
        </label>
        <span className="text-accent-8">
          <span className="inline-block align-middle ">
            <Info width="15" height="15" />
          </span>{' '}
          <span className="leading-6 text-sm">
            <strong>Legalleee</strong>: suhlasis
          </span>
        </span>
        <div className="pt-2 w-full flex flex-col">
          <Button
            variant="slim"
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Sign Up
          </Button>
        </div>
        <span className="pt-1 text-center text-sm">
          <span className="text-accent-7">Do you have an account?</span>
          {` `}
          <a
            className="text-accent-9 font-bold hover:underline cursor-pointer"
            onClick={() => setModalView('LOGIN_VIEW')}
          >
            Log In
          </a>
        </span>
      </div>
    </form>
  )
}

export default SignUpView
