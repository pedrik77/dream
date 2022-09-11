import { useAuthContext } from '@lib/auth'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const className =
  'fixed cursor-pointer h-16 w-16 rounded-2xl z-50  text-sm hidden md:flex justify-center align-center'

const buttonBg = 'bg-primary border-2 border-secondary text-white'

export default function AdminWidget() {
  const { permissions, adminEditingMode, adminStartEditing, adminStopEditing } =
    useAuthContext()

  const [showMenu, setShowMenu] = useState(false)

  if (!permissions.length) return null

  return (
    <div
      className={`${className} right-12 bottom-12 ${
        adminEditingMode ? buttonBg : 'bg-secondary'
      }`}
      onClick={adminEditingMode ? adminStopEditing : adminStartEditing}
      onMouseEnter={() => setTimeout(() => setShowMenu(true), 100)}
      onMouseLeave={() => setTimeout(() => setShowMenu(false), 100)}
    >
      {showMenu && <Menu />}
    </div>
  )
}

function Menu() {
  const router = useRouter()

  return (
    <div
      className={`${className} right-12 bottom-32 ${buttonBg}`}
      onClick={() => router.push('/admin')}
    >
      Admin
    </div>
  )
}
