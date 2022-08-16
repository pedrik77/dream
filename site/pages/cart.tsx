import { Layout } from '@components/common'
import { Button, Text, Container } from '@components/ui'
import Stepper from '@components/cart/Stepper'
import { useEffect, useMemo, useState } from 'react'
import { useShopContext } from '@lib/shop'
import Products from '@components/cart/steps/Products'
import Information from '@components/cart/steps/Information'
import Payment from '@components/cart/steps/Payment'
import Done from '@components/cart/steps/Done'

const STEPS = ['Košík', 'Informácie', 'Platba', 'Hotovo'] as const

type StepType = typeof STEPS[number]

export default function Cart() {
  const [active, setActive] = useState<StepType>(STEPS[0])
  const { isEmptyCart } = useShopContext()

  useEffect(() => {
    if (isEmptyCart()) firstStep()
  }, [isEmptyCart])

  const nextDisabled = useMemo(
    () => active === STEPS[STEPS.length - 1],
    [active]
  )

  const prevDisabled = useMemo(() => active === STEPS[0], [active])

  const steps = [
    {
      title: 'Košík',
      component: Products,
    },
    {
      title: 'Informácie',
      component: Information,
    },
    {
      title: 'Platba',
      component: Payment,
    },
    { title: 'Hotovo', component: Done },
  ]

  const Step = steps.find((step) => step.title === active)?.component

  const firstStep = () => setActive(STEPS[0])

  const onNext = async () => {
    if (nextDisabled) return

    setActive(STEPS[STEPS.indexOf(active) + 1])
  }

  const onPrev = () => {
    if (prevDisabled) return
    setActive(STEPS[STEPS.indexOf(active) - 1])
  }

  return (
    <section className="grid grid-cols-6 md:grid-cols-12 gap-4 center my-8 mx-auto lg:mx-auto pt-4 max-w-6xl">
      <Text
        variant="heading"
        className="col-span-full md:col-span-3 text-center"
      >
        {active}
      </Text>
      <div className="col-span-full md:col-span-9 align-left items-center">
        <Stepper steps={STEPS} activeStep={active} />
      </div>
      <div className="col-span-full flex flex-col center justify-between mt-4 sm:px-4">
        {Step && <Step onNext={onNext} onPrev={onPrev} />}
      </div>
    </section>
  )
}

Cart.Layout = Layout
