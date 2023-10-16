// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import {
  AppCheck,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const appCheckSiteKey =
  process.env.NEXT_PUBLIC_GOOGLE_APP_CHECK_CAPTCHA_KEY || ''

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA7rOtbdMOeHxVCT8WRrAtB8frxFiRDLrQ',
  authDomain: 'dream-38748.firebaseapp.com',
  projectId: 'dream-38748',
  storageBucket: 'dream-38748.appspot.com',
  messagingSenderId: '241683362351',
  appId: '1:241683362351:web:f09cf2c21c279fbf310cda',
  measurementId: 'G-P0CET49MP2',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

export const analytics =
  typeof window !== 'undefined' ? getAnalytics(app) : null

export let appCheck: AppCheck

if (typeof window !== 'undefined') {
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true, // Set to true to allow auto-refresh.
  })

  console.log('app check initialized', appCheck)
}

export const db = getFirestore(app)
export const storage = getStorage(app)
