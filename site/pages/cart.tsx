import { Layout } from '@components/common'
import { Button, Text, Container } from '@components/ui'
import Stepper from '@components/cart/Stepper'

export default function Cart() {
  return (
    <Container className="grid lg:grid-cols-3 pt-4 gap-20">
      <Text variant="heading">Košík</Text>
      <Container clean>
        <Stepper />
      </Container>
    </Container>
  )
}

Cart.Layout = Layout
