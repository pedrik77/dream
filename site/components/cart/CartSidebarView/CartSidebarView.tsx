import { FC } from 'react'
import s from './CartSidebarView.module.css'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'
import Products from '../Products/Products'

const CartSidebarView: FC = () => {
  const { closeSidebar } = useUI()

  const handleClose = () => closeSidebar()

  return (
    <SidebarLayout handleClose={handleClose}>
      <Products sidebar={true} />
    </SidebarLayout>
  )
}

export default CartSidebarView
