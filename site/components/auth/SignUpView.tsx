import { FC, FormEventHandler, useState } from 'react'
import { Info } from '@components/icons'
import { useUI } from '@components/ui/context'
import { Logo, Button, Input } from '@components/ui'
import { signInVia, signUp } from '@lib/auth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { flash } from '@components/ui/FlashMessage'
import { StringMap } from '@lib/common-types'

export const MIN_PASSWORD_LENGTH = 8

const FlashMessages: StringMap = {
  confirm:
    'Na overenie vašej e-mailovej adresy kliknite na odkaz v e-maile, ktorý sme vám poslali',
  success: 'Gratulujeme, vaša registrácia prebehla úspešne!',
  'auth/email-already-in-use': 'Táto e-mailová adresa je už registrovaná.',
}

const SignUpView = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const { setModalView, closeModal } = useUI()

  const handleSignUp: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      flash(FlashMessages.confirm, 'info')
      await signUp(email, password, newsletter)
      setLoading(false)
      closeModal()

      router.push('/account')
    } catch (e: any) {
      flash(FlashMessages[e.code] ?? e.message, 'danger')
      setLoading(false)
    }
  }

  const handleFbSignUp = () => signInVia('fb')

  return (
    <form
      onSubmit={handleSignUp}
      className="w-80 flex flex-col justify-between p-3"
    >
      <div className="flex justify-center pb-12 ">
        <Logo />
      </div>
      <div className="flex flex-col space-y-4 text-accent-0">
        <Input required type="email" placeholder="Email" onChange={setEmail} />
        <Input
          required
          type="password"
          placeholder="Heslo"
          onChange={setPassword}
        />
        <label className="text-sm">
          <input
            className="mr-2"
            type="checkbox"
            onChange={(e) => setNewsletter(e.target.checked)}
          />{' '}
          Newsletter
        </label>
        <span className="text-accent-0">
          <span className="inline-block align-middle mr-2">
            <Info width="15" height="15" />
          </span>{' '}
          <span className="leading-6 text-sm">
            Prečítal/a som si{' '}
            <strong>
              <Link href="/legal">Všeobecné obchodné podmienky</Link>
            </strong>{' '}
            a súhlasím s nimi.
          </span>
        </span>
        <span className="text-accent-0">
          <span className="inline-block align-middle mr-2">
            <Info width="15" height="15" />
          </span>{' '}
          <span className="leading-6 text-sm">
            <strong>
              <Link href="/gdpr">Informácie o spracovaní osobných údajov</Link>
            </strong>{' '}
          </span>
        </span>
        <div className="pt-2 w-full flex flex-col space-y-3">
          <Button
            variant="slim"
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Registrovať
          </Button>
          <Button variant="slim" type="button" onClick={handleFbSignUp}>
            Registrovať cez Facebook
          </Button>
        </div>
        <span className="pt-1 text-center text-sm">
          <span className="text-secondary">Máte už konto?</span>
          {` `}
          <a
            className="text-accent-0 font-bold hover:underline cursor-pointer"
            onClick={() => setModalView('LOGIN_VIEW')}
          >
            Prihlásiť
          </a>
        </span>
      </div>
    </form>
  )
}

export default SignUpView
