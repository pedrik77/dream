import { Layout } from '@components/common'
import { Button, Text, Container } from '@components/ui'
import Stepper from '@components/cart/Stepper'
import { useMemo, useState } from 'react'
import Products from '@components/cart/Products/Products'
import Information from '@components/cart/Information/Information'
import Payment from '@components/cart/Payment/Payment'
import { useShop } from '@lib/shop'
import Link from 'next/link'

const STEPS = ['Košík', 'Informácie', 'Platba', 'Hotovo'] as const

type StepType = typeof STEPS[number]

export default function Cart() {
  const [active, setActive] = useState<StepType>(STEPS[0])

  const { isEmptyCart } = useShop()

  const nextDisabled = useMemo(
    () => active === STEPS[STEPS.length - 1],
    [active]
  )

  const prevDisabled = useMemo(() => active === STEPS[0], [active])

  const step = steps.find((step) => step.title === active)?.component
  const nextLabel = steps.find((step) => step.title === active)?.nextLabel
  const onNext =
    steps.find((step) => step.title === active)?.onNext || (() => {})

  const next = async () => {
    if (nextDisabled) return
    setActive(STEPS[STEPS.indexOf(active) + 1])
    onNext()
  }

  const prev = async () => {
    if (prevDisabled) return
    setActive(STEPS[STEPS.indexOf(active) - 1])
  }

  return (
    <Container className="grid lg:grid-cols-12 pt-4 gap-4 center my-8">
      <Text variant="heading" className="col-span-3 text-center">
        Košík
      </Text>
      <Container clean className="col-span-9 align-left">
        <Stepper steps={STEPS} activeStep={active} />
      </Container>
      {isEmptyCart ? (
        <Container clean>
          <Text variant="sectionHeading" className="my-4">
            Košík je prázdny :(
          </Text>
          <Link href="/products">
            <a>Pozriet ponuku</a>
          </Link>
        </Container>
      ) : (
        <Container className="col-span-12 center justify-between">
          {step}
          <div>
            <Button className={prevDisabled ? 'invisible' : ''} onClick={prev}>
              Spat
            </Button>
            <Button className={nextDisabled ? 'invisible' : ''} onClick={next}>
              {nextLabel}
            </Button>
          </div>
        </Container>
      )}
    </Container>
  )
}

const steps = [
  {
    title: 'Košík',
    component: <Products />,
    nextLabel: 'Do checkoutu',
    onNext: () => {},
  },
  {
    title: 'Informácie',
    component: <Information />,
    nextLabel: 'Pokracovat na platbu',
    onNext: () => {},
  },
  {
    title: 'Platba',
    component: <Payment />,
    nextLabel: 'Zaplatit',
    onNext: () => {},
  },
]

Cart.Layout = Layout
