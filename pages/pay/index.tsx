import { getOrder, Order } from '@lib/api/shop/orders'
import { Container } from '@components/ui'
import { GetServerSideProps } from 'next'

export default function Pay(order: Order) {
  console.log("Order: ", order)
  return <Container>
    Platím ja
  </Container>
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.order) throw new Error('Invalid order number=' + query.order)
  const order = await getOrder(query.order as string)
  return ({
    props: { order }
  })
}
