import { Layout } from '@components/common'
import { Button, Text, Container } from '@components/ui'
import Stepper from '@components/cart/Stepper'
import { useMemo, useState } from 'react'
import Products from '@components/cart/Products/Products'

const STEPS = ['Košík', 'Informácie', 'Platba', 'Hotovo'] as const

type StepType = typeof STEPS[number]

export default function Cart() {
  const [active, setActive] = useState<StepType>(STEPS[0])

  const nextDisabled = useMemo(
    () => active === STEPS[STEPS.length - 1],
    [active]
  )

  const prevDisabled = useMemo(() => active === STEPS[0], [active])

  const next = async () => {
    if (nextDisabled) return
    setActive(STEPS[STEPS.indexOf(active) + 1])
  }

  const prev = async () => {
    if (prevDisabled) return
    setActive(STEPS[STEPS.indexOf(active) - 1])
  }

  const step = steps.find((step) => step.title === active)?.component

  return (
    <Container className="grid lg:grid-cols-3 pt-4 gap-20">
      <Text variant="heading">Košík</Text>
      <Container clean>
        <Stepper steps={STEPS} activeStep={active} />
        {step}
        <Button disabled={prevDisabled} onClick={prev}>
          Spat
        </Button>
        <Button disabled={nextDisabled} onClick={next}>
          Ďalej
        </Button>
      </Container>
    </Container>
  )
}

const steps = [{ title: 'Košík', component: <Products /> }]

Cart.Layout = Layout
