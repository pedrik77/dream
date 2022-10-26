import { FC, useEffect, useState, useCallback, FormEventHandler } from 'react'
import { Logo, Button, Input } from '@components/ui'
import { useUI } from '@components/ui/context'
import { validate } from 'email-validator'
import { signIn, signInVia } from '@lib/api/page/auth'
import { useRouter } from 'next/router'
import { flash } from '@components/ui/FlashMessage'
import { StringMap } from '@lib/types'
import useLoading from '@lib/hooks/useLoading'
import { useTranslation } from 'react-i18next'
import { linkWithPopup, UserCredential } from 'firebase/auth'
import { z, ZodError } from 'zod'
import { LoginSchema } from '@lib/schemas/auth'

const FlashMessages: StringMap = {
  success: 'Vitajte naspäť, sme radi, že vás tu máme!',
  'auth/wrong-password': 'Heslo je nesprávne',
  'auth/account-exists-with-different-credential':
    'Účet s daným emailom už existuje, prihláste sa prosím inou metódou',
}

const LoginView = () => {
  const loading = useLoading()
  const { setModalView, closeModal } = useUI()

  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = async (callback: () => Promise<UserCredential>) => {
    loading.start()
    try {
      const result = await callback()

      flash(FlashMessages.success, 'success')
      closeModal()

      return result
    } catch (e: any) {
      if (e instanceof ZodError) {
        e.issues.map((i) => flash(i.message, 'danger'))
      } else if (e.code === 'auth/user-not-found') {
        flash(({ deleteFlash }) => {
          return (
            <span>
              {t('signIn.unknown')}{' '}
              <a
                href="#"
                onClick={(e) => {
                  deleteFlash()
                  setModalView('SIGNUP_VIEW')
                }}
                className="text-bold"
              >
                {t('signIn.signIn')}
              </a>
            </span>
          )
        }, 'danger')
      } else {
        flash(FlashMessages[e.code] ?? e.message, 'danger')
      }
    } finally {
      loading.stop()
    }
  }

  const handleLogin: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    login(() => {
      LoginSchema.parse({ email, password })
      return signIn(email, password)
    })
  }

  const handleFbLogin = () => login(() => signInVia('fb'))

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
          autoComplete="on"
          value={email}
        />
        <Input
          variant="form"
          required
          type="password"
          placeholder="Heslo"
          onChange={setPassword}
          autoComplete="on"
          value={password}
        />

        <Button
          variant="slim"
          type="submit"
          className="hover:border-2 border-secondary"
          loading={loading.pending}
          disabled={loading.pending}
        >
          Prihlásiť
        </Button>
        <Button
          variant="slim"
          type="button"
          className="hover:border-2 border-secondary"
          onClick={handleFbLogin}
          loading={loading.pending}
          disabled={loading.pending}
        >
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
