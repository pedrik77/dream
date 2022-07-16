import React from 'react'
import s from './Tab.module.css'

interface TabProps {
  active?: boolean
}

export const Tab: React.FC<TabProps> = ({ active, children }) => {
  return (
    <button className={`${s.root} ${active ? s.active : ''}`}>
      {children}
    </button>
  )
}
