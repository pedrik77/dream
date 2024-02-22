import { getOrder, Order } from '@lib/api/shop/orders'
import { Container } from '@components/ui'
import { GetServerSideProps } from 'next'
import { useEffect, useRef } from 'react'
import * as process from 'process'
import dayjs from 'dayjs'


import utc from 'dayjs/plugin/utc'

const baseUrl = process.env.NEXT_PUBLIC_URL
dayjs.extend(utc)

export default function Pay(order: Order, clientIp: string) {

  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!btnRef.current) return
    btnRef.current.click()
  }, [])

  return <Container>
    {/*<form action="https://moja.tatrabanka.sk/cgi-bin/e-commerce/start/cardpay" method="post" id="form1">*/}
    <form action="urlbanky" method="post">
      <input type="hidden" name="MID" value="10324" />
      <input type="hidden" name="AMT" value={order.total_price} />
      <input type="hidden" name="CURR" value="978" />
      <input type="hidden" name="VS" value={order.reference} />
      <input type="hidden" name="RURL" value={baseUrl + '/pay/payment-return'} /> {/* TODO upravit slug*/}
      <input type="hidden" name="IPC" value={clientIp} />
      <input type="hidden" name="NAME" value={order.customer.email} />
      <input type="hidden" name="TIMESTAMP" value={dayjs.utc().format('DDMMYYYYHHmmss')} />
      <input type="hidden" name="HMAC" value="tu bude hmac" />
      <button ref={btnRef}>Zaplatiť</button>
    </form>
  </Container>
}

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  if (!query.order) throw new Error('Invalid order number=' + query.order)
  const clientIp = (req.headers['X-Forwarded-For'])
  const order = await getOrder(query.order as string)
  return ({
    props: { order, clientIp }
  })
}
