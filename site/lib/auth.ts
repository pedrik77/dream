import { useEffect, useMemo, useState } from 'react'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as authSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
  signInWithRedirect,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from 'firebase/auth'
import { app, db } from './firebase'
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { subscribe } from './newsletter'
import { flash } from '@components/ui/FlashMessage'

export const NULL_CUSTOMER_DATA = {
  fullname: '',
  phone: '',
  address: {
    street: '',
    city: '',
    country: '',
    zip: '',
  },
}

export type ProviderType = 'fb' | 'google'

export type CustomerData = typeof NULL_CUSTOMER_DATA

const auth = getAuth(app)

function getProvider(provider: ProviderType) {
  if (provider === 'fb') return new FacebookAuthProvider()

  if (provider === 'google') return new GoogleAuthProvider()

  throw new Error('Unknown provider')
}

export function useUser() {
  const [user, setUser] = useState<User | undefined>()
  const [customer, setCustomer] = useState<CustomerData>(NULL_CUSTOMER_DATA)

  const isLoggedIn = useMemo(() => !!user, [user])

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user)
        } else {
          setUser(undefined)
        }
      }),
    []
  )

  useEffect(() => {
    if (!user) return setCustomer(NULL_CUSTOMER_DATA)

    return onSnapshot(
      doc(db, 'customers', user.uid),
      (doc) => {
        const data = doc.data()
        console.log('customer data', data)

        setCustomer(data as CustomerData)
      },
      (err) => {
        console.error(err)
        flash('Error loading customer data: ' + err.message, 'danger')
      }
    )
  }, [user])

  return { user, customer, isLoggedIn }
}

export function useAdmin() {
  const { user } = useUser()

  const [permissions, setPermissions] = useState<string[]>([])

  const hasPermission = (permission: string) => permissions.includes(permission)

  useEffect(() => {
    if (!user || !user.email) return

    return onSnapshot(
      doc(db, 'admins', user.email),
      (doc) => {
        const data = doc.data()
        console.log('admin data', data)

        if (!data) return setPermissions([])

        setPermissions(data.permissions)
      },
      (err) => console.error(err)
    )
  }, [user])

  return {
    permissions,
    isAdmin: !!permissions.length,
    hasPermission,
  }
}

export async function signUp(
  email: string,
  password: string,
  newsletter = false
) {
  const result = await createUserWithEmailAndPassword(auth, email, password)

  sendEmailVerification(result.user)

  const { uid } = result.user

  setCustomerProfile(uid, NULL_CUSTOMER_DATA)

  if (newsletter) {
    await subscribe(email)
  }

  return result
}

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function signInVia(provider: ProviderType) {
  return signInWithRedirect(auth, getProvider(provider))
}

export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email)
}

export function signOut() {
  return authSignOut(auth)
}

export function setCustomerProfile(uid: string, data: CustomerData) {
  const docRef = doc(db, 'customers', uid)
  return setDoc(docRef, data)
}
