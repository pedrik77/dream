import { getOrder, Order } from '@lib/api/shop/orders'
import { Container } from '@components/ui'
import { GetServerSideProps } from 'next'
import { useEffect, useRef } from 'react'
import * as process from 'process'
import dayjs from 'dayjs'

import crypto from 'crypto'
import utc from 'dayjs/plugin/utc'
import { calculateHmac, concatStringToSignForRequest, PaymentRequestModel, hmacKeyEnv } from '@lib/payment-util'

const baseUrl = process.env.NEXT_PUBLIC_URL
const paymentGateUrl = process.env.PAYMENT_GATE_URL

export default function Pay({ paymentFormModel }: { paymentFormModel: PaymentRequestModel }) {

  const btnRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!btnRef.current) return
    // btnRef.current.click()
  }, [])
  return <Container>
    {/*TODO: prod value: https://moja.tatrabanka.sk/cgi-bin/e-commerce/start/cardpay*/}
    <form action={paymentGateUrl} method="post">
      <input type="hidden" name="MID" value={paymentFormModel.mid} />
      <input type="hidden" name="AMT" value={paymentFormModel.amt} />
      <input type="hidden" name="CURR" value={paymentFormModel.curr} />
      <input type="hidden" name="VS" value={paymentFormModel.vs} />
      <input type="hidden" name="RURL" value={paymentFormModel.rurl} />
      <input type="hidden" name="IPC" value={paymentFormModel.ipc} />
      <input type="hidden" name="NAME" value={paymentFormModel.name} />
      <input type="hidden" name="TIMESTAMP" value={paymentFormModel.timestamp} />
      <input type="hidden" name="HMAC" value={paymentFormModel.hmac} />
      <button ref={btnRef}>Zaplatiť</button>
    </form>
  </Container>
}

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  if (!query.order) throw new Error('Invalid order number=' + query.order)
  const clientIp = req.ip || '127.0.0.1'
  const order = await getOrder(query.order as string)
  const paymentFormModel = constructPaymentRequestModel(order, clientIp)
  return ({
    props: { paymentFormModel }
  })
}

function constructPaymentRequestModel(order: Order, clientIp: string) {
  dayjs.extend(utc)
  const paymentFormModel: PaymentRequestModel = {
    mid: '10324',
    amt: order.total_price + '',
    curr: '978',
    vs: order.reference,
    rurl: baseUrl + '/pay/payment-result',
    ipc: clientIp,
    name: order.customer.email,
    timestamp: dayjs.utc().format('DDMMYYYYHHmmss')
  }
  const stringToSign = concatStringToSignForRequest(paymentFormModel)
  paymentFormModel.hmac = calculateHmac(hmacKeyEnv(), stringToSign)
  return paymentFormModel
}

