import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import NextNProgress from 'nextjs-progressbar'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import sk from '@translations/sk.json'
import en from '@translations/en.json'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      sk: {
        translation: sk,
      },
      en: {
        translation: en,
      },
    },
    fallbackLng: 'sk',

    interpolation: {
      escapeValue: false,
    },
  })

const Noop: FC = ({ children }) => <>{children}</>

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  return (
    <>
      <NextNProgress color="#f5b612" options={{ showSpinner: false }} />
      <Head />
      <ManagedUIContext>
        <Layout pageProps={pageProps}>
          {/* @ts-ignore */}
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
    </>
  )
}
