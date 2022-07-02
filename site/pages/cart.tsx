import { Layout } from '@components/common'
import { Button, Text, Container } from '@components/ui'
import Stepper from '@components/cart/Stepper'
import { useState } from 'react'
import Products from '@components/cart/Products/Products'

const STEPS = ['Košík', 'Informácie', 'Platba', 'Hotovo'] as const

type StepType = typeof STEPS[number]

export default function Cart() {
  const [active, setActive] = useState<StepType>(STEPS[0])

  const next = async () => {
    if (active === STEPS[STEPS.length - 1]) throw Error()
    setActive(STEPS[STEPS.indexOf(active) + 1])
  }

  const prev = async () => {
    if (active === STEPS[0]) throw Error()
    setActive(STEPS[STEPS.indexOf(active) - 1])
  }

  const step = steps.find((step) => step.title === active)?.component
  return (
    <Container className="grid lg:grid-cols-12 pt-4 gap-4 center my-8">
      <Text variant="heading" className="col-span-3 text-center">
        Košík
      </Text>
      <Container clean className="col-span-9 align-left">
        <Stepper steps={STEPS} activeStep={active} />
        {step}
      </Container>
    </Container>
  )
}

const steps = [{ title: 'Košík', component: <Products /> }]

Cart.Layout = Layout
