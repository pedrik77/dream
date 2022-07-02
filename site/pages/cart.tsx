import { Layout } from '@components/common'
import { Button, Text, Container } from '@components/ui'
import Stepper from '@components/cart/Stepper'
import { useMemo, useState } from 'react'
import Products from '@components/cart/Products/Products'
import Information from '@components/cart/Information/Information'
import Payment from '@components/cart/Payment/Payment'
import { useShop } from '@lib/shop'
import Link from 'next/link'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { useRouter } from 'next/router'

const STEPS = ['Košík', 'Informácie', 'Platba', 'Hotovo'] as const

type StepType = typeof STEPS[number]

export default function Cart() {
  const [active, setActive] = useState<StepType>(STEPS[0])

  const { placeOrder, isEmptyCart, clearCart } = useShop()

  const router = useRouter()

  const nextDisabled = useMemo(
    () => active === STEPS[STEPS.length - 1],
    [active]
  )

  const prevDisabled = useMemo(() => active === STEPS[0], [active])

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
      onNext: () => {
        placeOrder()
          .then(() => {
            flash('Vaše objednávka bola úspešne odoslaná')
            clearCart()
            router.push('/orders')
          })
          .catch(handleErrorFlash)
      },
    },
  ]

  const step = steps.find((step) => step.title === active)?.component
  const nextLabel = steps.find((step) => step.title === active)?.nextLabel
  const onNext =
    steps.find((step) => step.title === active)?.onNext || (() => {})

  const next = () => {
    if (nextDisabled) return
    setActive(STEPS[STEPS.indexOf(active) + 1])
    onNext()
  }

  const prev = () => {
    if (prevDisabled) return
    setActive(STEPS[STEPS.indexOf(active) - 1])
  }

  return (
    <section className="grid lg:grid-cols-12 pt-4 gap-4 center my-8 px-4">
      <Text variant="heading" className="col-span-12 md:col-span-3 text-center">
        Košík
      </Text>
      <Container className="col-span-12 md:col-span-9 align-left">
        <Stepper steps={STEPS} activeStep={active} />
      </Container>
      {isEmptyCart() ? (
        <Container className="col-span-12 flex flex-col justify-center center text-center my-4">
          <Text variant="sectionHeading" className="my-4">
            Košík je prázdny :(
          </Text>
          <Link href="/products">
            <a>Pozriet ponuku</a>
          </Link>
        </Container>
      ) : (
        <div className="col-span-12 flex flex-col center justify-between">
          {step}
          <div className="flex center items-center my-8">
            <Button className={prevDisabled ? 'invisible' : ''} onClick={prev}>
              Spat
            </Button>
            <Button className={nextDisabled ? 'invisible' : ''} onClick={next}>
              {nextLabel}
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

Cart.Layout = Layout
