import React from 'react'
import s from './Tab.module.css'

interface TabProps {
  active?: boolean
  onClick?: () => void
}

export const Tab: React.FC<TabProps> = ({ active, onClick, children }) => {
  return (
    <button onClick={onClick} className={`${s.root} ${active ? s.active : ''}`}>
      {children}
    </button>
  )
}
