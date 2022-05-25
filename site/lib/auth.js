import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
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

export function useUser({ redirectTo = '', redirectIfFound = false } = {}) {
  const [user, setUser] = useState(null)
  const router = useRouter()

  const isLoggedIn = useMemo(() => !!user, [user])

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const result = await getDoc(doc(db, 'customers', user.uid))
          setUser({ ...user, ...result.data() })
        } else {
          setUser(null)
        }
      }),
    []
  )

  useEffect(() => {
    if (!redirectTo) return

    if (
      (redirectTo && !redirectIfFound && !isLoggedIn) ||
      (redirectIfFound && isLoggedIn)
    ) {
      router.push(redirectTo)
    }
  }, [user, redirectIfFound, redirectTo, isLoggedIn, router])

  return { user, isLoggedIn }
}

export async function signUp(email, password, newsletter = false) {
  const result = await createUserWithEmailAndPassword(auth, email, password)

  sendEmailVerification(result.user)

  const { uid } = result.user

  const docRef = doc(db, 'customers', uid)
  await setDoc(docRef, {
    fullname: '',
    phone: '',
    address: {},
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
