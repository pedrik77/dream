import { Text } from '@components/ui'
import { useShopContext } from '@lib/shop'
import React from 'react'

export default function Payment() {
  const { total } = useShopContext()

  return (
    <div className="flex justify-center my-12">
      <Text variant="pageHeading">Cash {total} eur</Text>
    </div>
  )
}
