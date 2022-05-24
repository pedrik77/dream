// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export { app, analytics }
