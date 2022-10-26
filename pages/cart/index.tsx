import { Layout } from '@components/common'
import { Button, Text, Container } from '@components/ui'
import Stepper from '@components/cart/Stepper'
import { useEffect, useMemo, useState } from 'react'
import { useShopContext } from '@lib/api/shop'
import steps from '@components/cart/steps'

export default function Cart() {
  const [active, setActive] = useState(0)
  const { isEmptyCart } = useShopContext()

  useEffect(() => {
    if (isEmptyCart()) setActive(0)
  }, [isEmptyCart])

  const nextDisabled = useMemo(() => active === steps.length - 1, [active])

  const prevDisabled = useMemo(() => active === 0, [active])

  const [StepTitle, StepComponent] = steps[active]

  const onNext = async () => {
    if (nextDisabled) return
    setActive(active + 1)
  }

  const onPrev = () => {
    if (prevDisabled) return
    setActive(active - 1)
  }

  return (
    <section className="grid grid-cols-6 md:grid-cols-12 gap-4 center my-8 mx-auto lg:mx-auto pt-4 max-w-6xl">
      <Text
        variant="heading"
        className="col-span-full md:col-span-3 text-center"
      >
        {StepTitle}
      </Text>
      <div className="col-span-full md:col-span-9 align-left items-center">
        <Stepper
          steps={steps.map(([title]) => title as string)}
          activeStep={active}
        />
      </div>
      <div className="col-span-full flex flex-col center justify-between mt-4 sm:px-4">
        <StepComponent onNext={onNext} onPrev={onPrev} />
      </div>
    </section>
  )
}

Cart.Layout = Layout
