import { Layout } from '@components/common'
import { Button, Text, Container } from '@components/ui'
import Stepper from '@components/cart/Stepper'
import { useShop } from '@lib/shop'

export default function Cart() {
  const { cart } = useShop()

  return (
    <Container className="grid lg:grid-cols-12 pt-4 gap-20">
      <Text variant="heading" className="col-span-6">
        Košík
      </Text>
      <Stepper className="col-span-6" />
    </Container>
  )
}

Cart.Layout = Layout
