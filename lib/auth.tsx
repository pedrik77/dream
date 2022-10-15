import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as authSignOut,
  sendPasswordResetEmail,
  User,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { app, db } from './firebase'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore'
import { subscribe } from './newsletter'
import { flash } from '@components/ui/FlashMessage'
import { sendResetPasswordEmail, sendVerificationEmail } from './emails'
import { WidgetProvider } from './adminWidget'
import { noop } from './common'
import { v4 as uuid4 } from 'uuid'
import { api } from './api'

const placeholder = `https://avatars.dicebear.com/api/pixel-art-neutral/bezpohlavny.svg`

export const NULL_CUSTOMER_DATA = {
  email: '',
  firstname: '',
  lastname: '',
  phone: '',
  avatar: placeholder,
  verified: false,
  address: {
    street: '',
    city: '',
    country: '',
    zip: '',
  },
  company: {
    name: '',
    business_id: '',
    tax_id: '',
    vat_id: '',
  },
}

export type TokenData = {
  email: string
  created: Timestamp
}

export type ProviderType = 'fb' | 'google'

export type CustomerDataType = typeof NULL_CUSTOMER_DATA

export const PERMISSIONS = {
  USER: 'user',

  ADMIN: 'admin',

  SUPERADMIN: 'superadmin',

  ORDERS_LIST: 'orders.list',

  USERS_LIST: 'users.list',

  CATEGORIES_LIST: 'categories.list',
  CATEGORIES_FORM: 'categories.form',
  CATEGORIES_DELETE: 'categories.delete',

  WINNERS_LIST: 'winners.list',
  WINNERS_DRAW: 'winners.draw',

  PAGES_LIST: 'pages.list',
  PAGES_FORM: 'pages.form',
  PAGES_DELETE: 'pages.delete',

  PRODUCTS_LIST: 'products.list',
  PRODUCTS_FORM: 'products.form',
  PRODUCTS_DELETE: 'products.delete',

  MENU_LIST: 'menu.list',
  MENU_FORM: 'menu.form',
  MENU_DELETE: 'menu.delete',

  CMS: 'cms',

  EMAILS: 'emails',

  SHOP: 'shop',
} as const

type ContextType = {
  user?: User
  customer: CustomerDataType
  isLoggedIn: boolean
  permissions: string[]
  permissionsLoaded: boolean
  setCustomer: (customer: CustomerDataType) => void
}

const Context = createContext<ContextType>({
  user: undefined,
  customer: NULL_CUSTOMER_DATA,
  isLoggedIn: false,
  permissions: [],
  permissionsLoaded: false,
  setCustomer: noop,
})

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | undefined>()
  const [customer, setCustomer] = useState<CustomerDataType>(NULL_CUSTOMER_DATA)

  const [permissions, setPermissions] = useState<string[]>([])
  const [permissionsLoaded, setPermissionsLoaded] = useState(false)

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
    if (!user || !user.email) return setCustomer(NULL_CUSTOMER_DATA)

    return onSnapshot(
      doc(db, 'customers', user.email),
      (doc) => {
        const data = { ...doc.data(), email: doc.id } as CustomerDataType

        setCustomer({
          ...data,
          avatar: data.avatar || placeholder,
        })
      },
      (err) => {
        console.error(err)
        flash('Error loading customer data: ' + err.message, 'danger')
      }
    )
  }, [user])

  useEffect(() => {
    const permissionKey = !!user && user.email ? user.email : 'general'

    setPermissionsLoaded(false)
    return onSnapshot(
      doc(db, 'admins', permissionKey),
      (doc) => {
        setTimeout(() => setPermissionsLoaded(true))

        const data = doc.data()

        if (!data) return setPermissions([])

        setPermissions(data.permissions)
      },
      (err) => console.error(err)
    )
  }, [user])

  return (
    <Context.Provider
      value={{
        user,
        customer,
        isLoggedIn,
        permissions,
        permissionsLoaded,
        setCustomer,
      }}
    >
      <WidgetProvider>{children}</WidgetProvider>
    </Context.Provider>
  )
}

export const useAuthContext = () => useContext(Context)

const auth = getAuth(app)

function getProvider(provider: ProviderType) {
  if (provider === 'fb') return new FacebookAuthProvider()

  if (provider === 'google') return new GoogleAuthProvider()

  throw new Error('Unknown provider')
}

export async function signUp(
  email: string,
  password: string,
  newsletter = false
) {
  const result = await createUserWithEmailAndPassword(auth, email, password)

  setCustomerProfile({ ...NULL_CUSTOMER_DATA, email })

  sendVerificationEmail(email)

  signOut()
  if (newsletter) {
    await subscribe(email, true)
      .then(() => console.log('subscribed'))
      .catch((e) => {
        console.error(e)
      })
  }

  return result
}

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function signInVia(provider: ProviderType) {
  return signInWithPopup(auth, getProvider(provider))
}

export function resetPassword(email: string) {
  return sendResetPasswordEmail(email)
}

export function signOut() {
  return authSignOut(auth)
}

export function setCustomerProfile({ email, ...customer }: CustomerDataType) {
  const docRef = doc(db, 'customers', email)
  return setDoc(docRef, customer)
}

export async function getCustomerProfile(email: string) {
  const { data, id } = await getDoc(doc(db, 'customers', email))

  return { ...data, email: id } as CustomerDataType
}

export async function createToken(email: string) {
  const token = uuid4()

  const docRef = doc(db, 'tokens', token)

  await setDoc(docRef, { email, created: Timestamp.now() })

  return token
}

export async function verifyToken(token: string) {
  const docRef = doc(db, 'tokens', token)

  const snapshot = await getDoc(docRef)

  const data = { ...snapshot.data } as TokenData

  if (!data) throw new Error('invalid')

  const { email, created } = data

  if (created.toMillis() >= Date.now() - 1000 * 60 * 60 * 24)
    throw new Error('expired')

  await deleteDoc(docRef)

  return email
}

export async function verifyUser(token: string) {
  const email = await verifyToken(token)

  const customer = await getCustomerProfile(email)

  if (!customer) throw new Error('invalid')

  await setCustomerProfile({
    ...customer,
    verified: true,
  })

  return true
}

export async function verifyAndResetPassword(token: string, password: string) {
  const email = await verifyToken(token)
}
