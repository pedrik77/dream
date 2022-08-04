import AccountLayout from '@components/auth/AccountLayout'
import { Layout } from '@components/common'

export default function Prizes() {
  return (
    <AccountLayout current="prizes">
      <h1>Prizes</h1>
    </AccountLayout>
  )
}

Prizes.Layout = Layout
