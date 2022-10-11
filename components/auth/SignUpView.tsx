import { FC, FormEventHandler, useState } from 'react'
import { Info } from '@components/icons'
import { useUI } from '@components/ui/context'
import { Logo, Button, Input } from '@components/ui'
import { signInVia, signUp } from '@lib/auth'
import Link from 'next/link'
import { flash } from '@components/ui/FlashMessage'
import { StringMap } from '@lib/types'
import useLoading from '@lib/hooks/useLoading'
import { useTranslation } from 'react-i18next'
import { z, ZodError } from 'zod'
import { LoginSchema } from '@lib/schemas/auth'

const FlashMessages: StringMap = {
  confirm:
    'Na overenie vašej e-mailovej adresy kliknite na odkaz v e-maile, ktorý sme vám poslali',
  success: 'Gratulujeme, vaša registrácia prebehla úspešne!',
  'auth/email-already-in-use': 'Táto e-mailová adresa je už registrovaná.',
}

const SignUpView = () => {
  const { setModalView, closeModal } = useUI()
  const loading = useLoading()

  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newsletter, setNewsletter] = useState(false)

  const handleSignUp: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    loading.start()

    try {
      LoginSchema.parse({ email, password })

      signUp(email, password, newsletter).then(() => {
        flash(FlashMessages.confirm, 'info')
        closeModal()
      })
    } catch (e: any) {
      if (e instanceof ZodError) {
        e.issues.map((i) => flash(i.message, 'danger'))
      } else {
        flash(FlashMessages[e.code] ?? e.message, 'danger')
      }
    } finally {
      loading.stop()
    }
  }

  const handleFbSignUp = () => signInVia('fb')

  return (
    <form
      onSubmit={handleSignUp}
      className="w-70 sm:w-80 flex flex-col justify-between p-1 sm:p-3"
    >
      <div className="flex justify-center pb-12 ">
        <Logo />
      </div>
      <div className="flex flex-col space-y-4 text-accent-0">
        <Input
          required
          variant="form"
          type="email"
          placeholder="Email"
          autoComplete="on"
          onChange={setEmail}
        />
        <Input
          required
          variant="form"
          type="password"
          placeholder="Heslo"
          onChange={setPassword}
          autoComplete="on"
          value={password}
        />
        <label className="text-sm">
          <input
            className="mr-2"
            type="checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
          />{' '}
          {t('signUp.newsletter')}
        </label>
        <span className="text-accent-0">
          <span className="inline-block align-middle mr-2">
            <Info width="15" height="15" />
          </span>{' '}
          <span className="leading-6 text-xs sm:text-sm">
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
          <span className="leading-6 text-xs sm:text-sm">
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
