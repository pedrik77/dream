import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import sk from '../translations/sk.json'
import en from '../translations/en.json'

i18n.use(initReactI18next).init({
  resources: {
    sk: {
      translation: sk,
    },
    en: {
      translation: en,
    },
  },
  lng: 'sk',
  fallbackLng: 'sk',

  interpolation: {
    escapeValue: false,
  },
})

export default i18n
