import { FC, FormEventHandler, useState } from 'react'
import { Info } from '@components/icons'
import { useUI } from '@components/ui/context'
import { Logo, Button, Input } from '@components/ui'
import { signInVia, signUp } from '@lib/auth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { flash } from '@components/ui/FlashMessage'
import { StringMap } from '@lib/common-types'
import useLoading from '@lib/hooks/useLoading'

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

  const loading = useLoading()

  const router = useRouter()

  const { setModalView, closeModal } = useUI()

  const handleSignUp: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    loading.start()

    signUp(email, password, newsletter)
      .then(() => {
        flash(FlashMessages.confirm, 'info')
        closeModal()
        router.push('/account')
      })
      .catch((e) => flash(FlashMessages[e.code] ?? e.message, 'danger'))
      .finally(loading.stop)
  }

  const handleFbSignUp = () => signInVia('fb')

  return (
    <form
      onSubmit={handleSignUp}
      className="w-80 flex flex-col justify-between p-3"
    >
      <div className="flex justify-center pb-12 ">
        <Logo width={64} height={64} />
      </div>
      <div className="flex flex-col space-y-4">
        <Input required type="email" placeholder="Email" onChange={setEmail} />
        <Input
          required
          type="password"
          placeholder="Heslo"
          onChange={setPassword}
        />
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
            Prečítal/a som si{' '}
            <strong>
              <Link href="/legal">Všeobecné obchodné podmienky</Link>
            </strong>{' '}
            a súhlasím s nimi.
          </span>
        </span>
        <span className="text-accent-8">
          <span className="inline-block align-middle ">
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
            loading={loading.pending}
            disabled={loading.pending}
          >
            Registrovať
          </Button>
          <Button variant="slim" type="button" onClick={handleFbSignUp}>
            Registrovať cez Facebook
          </Button>
        </div>
        <span className="pt-1 text-center text-sm">
          <span className="text-accent-7">Máte už konto?</span>
          {` `}
          <a
            className="text-accent-9 font-bold hover:underline cursor-pointer"
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
