import { Text } from '@components/ui'
import { useUser } from '@lib/auth'
import React from 'react'

export default function Information() {
  const { user } = useUser()

  return (
    <div>
      <Text variant="sectionHeading" className="my-4">
        Informacie
      </Text>
      <div></div>
    </div>
  )
}
