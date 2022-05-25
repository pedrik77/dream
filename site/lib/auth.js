import { useEffect, useMemo, useState } from 'react'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as authSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth'
import { app, db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { subscribe } from './newsletter'

const auth = getAuth(app)

export function useUser() {
  const [user, setUser] = useState(null)
  const [customer, setCustomer] = useState(null)

  const isLoggedIn = useMemo(() => !!user, [user])

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUser(user)
        } else {
          setUser(null)
        }
      }),
    []
  )

  useEffect(() => {
    if (!user) return setCustomer(null)

    getDoc(doc(db, 'customers', user.uid))
      .then((doc) => {
        setCustomer(doc.data())
      })
      .catch(console.error)
  }, [user])

  return { user, customer, isLoggedIn }
}

export async function signUp(email, password, newsletter = false) {
  const result = await createUserWithEmailAndPassword(auth, email, password)

  sendEmailVerification(result.user)

  const { uid } = result.user

  setCustomerProfile(uid, {
    fullname: '',
    phone: '',
    address: {
      street: '',
      city: '',
      country: '',
      zip: '',
    },
  })

  if (newsletter) {
    await subscribe(email)
  }

  return result
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email)
}

export function signOut() {
  return authSignOut(auth)
}

export function setCustomerProfile(uid, data) {
  const docRef = doc(db, 'customers', uid)
  return setDoc(docRef, data)
}
