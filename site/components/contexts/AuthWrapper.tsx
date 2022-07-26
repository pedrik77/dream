import { useAuth } from '@lib/auth'
import { createContext, useContext } from 'react'

const AuthContext = createContext({})

export const AuthWrapper: React.FC = ({ children }) => {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
