import { Text } from '@components/ui'
import { useShop } from '@lib/shop'
import React from 'react'

export default function Payment() {
  const { total } = useShop()

  return <Text variant="pageHeading">Cash {total} eur</Text>
}
