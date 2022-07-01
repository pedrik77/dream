import { Layout } from '@components/common'
import { Button, Text, Container } from '@components/ui'
import Stepper from '@components/cart/Stepper'
import { useState } from 'react'
import { useShop } from '@lib/shop'
import Products from '@components/cart/Products/Products'

const STEPS = ['Košík', 'Informácie', 'Platba', 'Hotovo'] as const

type Step = typeof STEPS[number]

export default function Cart() {
  const [active, setActive] = useState<Step>(STEPS[0])

  const { cart } = useShop()

  return (
    <Container className="grid lg:grid-cols-3 pt-4 gap-20">
      <Text variant="heading">Košík</Text>
      <Container clean>
        <Stepper steps={STEPS} activeStep={active} />
      </Container>
      <Products />
    </Container>
  )
}

Cart.Layout = Layout
