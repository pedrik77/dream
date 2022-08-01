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

const placeholder = `https://api.lorem.space/image/burger?w=200&h=200`

export const NULL_CUSTOMER_DATA = {
  email: '',
  fullname: '',
  phone: '',
  avatar: placeholder,
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

export type ProviderType = 'fb' | 'google'

export type CustomerDataType = typeof NULL_CUSTOMER_DATA

export const PERMISSIONS = {
  SUPERADMIN: 'superadmin',
  ORDERS_LIST: 'orders.list',
  USERS_LIST: 'users.list',
  CATEGORIES_LIST: 'categories.list',
  PRODUCTS_LIST: 'products.list',
  WINNERS_LIST: 'winners.list',
  PAGES_LIST: 'pages.list',
  PRODUCTS_ADD: 'products.add',
  CMS: 'cms',
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
  setCustomer: () => {},
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
    if (!user || !user.email) return

    setPermissionsLoaded(false)
    return onSnapshot(
      doc(db, 'admins', user.email),
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
      {children}
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

  sendEmailVerification(result.user)

  setCustomerProfile({ ...NULL_CUSTOMER_DATA, email })

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
  return signInWithRedirect(auth, getProvider(provider))
}

export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email)
}

export function signOut() {
  return authSignOut(auth)
}

export function setCustomerProfile({ email, ...customer }: CustomerDataType) {
  const docRef = doc(db, 'customers', email)
  return setDoc(docRef, customer)
}
