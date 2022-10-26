import { flash } from '@components/ui/FlashMessage'
import { useAuthContext } from '@lib/auth'
import { createContext, useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { noop } from '../../common'

type ContextType = {
  canShowWidget: boolean
  isEditingMode: boolean
  isSavingNeeded: boolean
  needSaving: () => void
  startEditing: () => void
  stopEditing: () => void
}

const Context = createContext<ContextType>({
  canShowWidget: false,
  isEditingMode: false,
  isSavingNeeded: false,
  needSaving: noop,
  startEditing: noop,
  stopEditing: noop,
})

export const WidgetProvider: React.FC = ({ children }) => {
  const { t } = useTranslation()
  const { permissions } = useAuthContext()

  const [isEditingMode, setEditingMode] = useState(false)
  const [isSavingNeeded, setSavingNeeded] = useState(false)

  const needSaving = useCallback(() => setSavingNeeded(true), [])

  const saved = () => {
    if (isSavingNeeded) flash(t('saved'), 'success')

    setSavingNeeded(false)
  }

  const startEditing = () => setEditingMode(true)

  const stopEditing = async () => {
    setEditingMode(false)
    saved()
  }

  return (
    <Context.Provider
      value={{
        canShowWidget: !!permissions.length,
        isEditingMode,
        isSavingNeeded,
        needSaving,
        startEditing,
        stopEditing,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useAdminWidget = () => useContext(Context)
