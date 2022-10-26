import { useRouter } from 'next/router'
import { createContext } from 'react'

const Context = createContext('')

export const LocaleProvider: React.FC = ({ children }) => {
  const { locale = 'sk' } = useRouter()

  return <Context.Provider value={locale}>{children}</Context.Provider>
}
