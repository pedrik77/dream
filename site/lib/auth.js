import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as authSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { app } from './firebase'

const auth = getAuth(app)

export function useUser({ redirectTo = '', redirectIfFound = false } = {}) {
  const [user, setUser] = useState(null)
  const router = useRouter()

  const isLoggedIn = useMemo(() => !!user, [user])

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user)
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

export function signUp(email, password, newsletter = false) {
  return createUserWithEmailAndPassword(auth, email, password)
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
