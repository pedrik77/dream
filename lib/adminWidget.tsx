import { useAuthContext } from '@lib/auth'
import { createContext, useContext, useState } from 'react'

type ContextType = {
  canShowWidget: boolean
  isEditingMode: boolean
  startEditing: () => void
  stopEditing: () => void
}

const Context = createContext<ContextType>({
  canShowWidget: false,
  isEditingMode: false,
  startEditing: () => {},
  stopEditing: () => {},
})

export const WidgetProvider: React.FC = ({ children }) => {
  const { permissions } = useAuthContext()

  const [isEditingMode, setEditingMode] = useState(false)

  const startEditing = () => setEditingMode(true)

  const stopEditing = async () => {
    setEditingMode(false)
  }

  return (
    <Context.Provider
      value={{
        canShowWidget: !!permissions.length,
        isEditingMode,
        startEditing,
        stopEditing,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useAdminWidget = () => useContext(Context)
