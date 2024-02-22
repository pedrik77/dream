import { getOrder, Order } from '@lib/api/shop/orders'
import { Container } from '@components/ui'
import { GetServerSideProps } from 'next'
import { useEffect, useRef } from 'react'
import * as process from 'process'
import dayjs from 'dayjs'

import crypto from 'crypto'
import utc from 'dayjs/plugin/utc'

const baseUrl = process.env.NEXT_PUBLIC_URL
const paymentGateUrl = process.env.PAYMENT_GATE_URL


type PaymentFormModel = {
  mid: string,
  amt: string,
  curr: string,
  vs: string,
  rurl: string,
  ipc: string,
  name: string,
  timestamp: string,
  hmac?: string
}

export default function Pay({ paymentFormModel }: { paymentFormModel: PaymentFormModel }) {

  const btnRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!btnRef.current) return
    btnRef.current.click()
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
  const paymentFormModel = constructPaymentFormModel(order, clientIp)
  return ({
    props: { paymentFormModel }
  })
}

function constructPaymentFormModel(order: Order, clientIp: string) {
  dayjs.extend(utc)
  const paymentFormModel: PaymentFormModel = {
    mid: '10324',
    amt: order.total_price + '',
    curr: '978',
    vs: order.reference,
    rurl: baseUrl + '/pay/payment-result',
    ipc: clientIp,
    name: order.customer.email,
    timestamp: dayjs.utc().format('DDMMYYYYHHmmss')
  }
  const stringToSign = concatStringToSign(paymentFormModel)
  console.log('stringToSign', stringToSign)
  paymentFormModel.hmac = calculateHmac(hmacKey(), stringToSign)
  console.log('Form Model in constructPaymentFormModel', paymentFormModel)
  return paymentFormModel
}

function hexToBytes(hex: string) {
  const bytes = []
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16))
  }
  return new Uint8Array(bytes)
}

function bytesToHex({ bytes }: { bytes: Uint8Array }) {
  return Array.from(bytes, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2)
  }).join('')
}

function calculateHmac(key: string, stringToSign: string) {
  const keyBytes = hexToBytes(key)
  const hmac = crypto.createHmac('sha256', keyBytes)
  hmac.update(stringToSign)
  const hmacBin = hmac.digest()
  return bytesToHex({ bytes: hmacBin })
}

function concatStringToSign(model: PaymentFormModel): string {
  return `${model.mid}${model.amt}${model.curr}${model.vs}${model.rurl}${model.ipc}${model.name}${model.timestamp}`
}

function hmacKey(): string {
  const paymentHmacKey = process.env.PAYMENT_HMAC_KEY
  if (!paymentHmacKey) throw Error('PAYMENT_HMAC_KEY environment variable has to be set')
  return paymentHmacKey
}
