import { Container } from '@components/ui'
import { FormEvent, useRef } from 'react'
import { PaymentRequestModel } from '@lib/payments'
import { Layout } from '@components/common'

export default function PaymentTesting() {
  const hmacRef = useRef<HTMLInputElement>(null)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const paymentReqModel: PaymentRequestModel = {
      mid: e.target.querySelector('[name=MID]')?.value,
      amt: e.target.querySelector('[name=AMT]')?.value,
      curr: e.target.querySelector('[name=CURR]')?.value,
      vs: e.target.querySelector('[name=VS]')?.value,
      rurl: e.target.querySelector('[name=RURL]')?.value,
      ipc: e.target.querySelector('[name=IPC]')?.value,
      name: e.target.querySelector('[name=NAME]')?.value,
      timestamp: e.target.querySelector('[name=TIMESTAMP]')?.value,
    }
    console.log('Payment request model: ', paymentReqModel)
  }

  return (
    <Container>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input type="text" name="MID" />
        <input type="text" name="AMT" />
        <input type="text" name="CURR" />
        <input type="text" name="VS" />
        <input type="text" name="RURL" />
        <input type="text" name="IPC" />
        <input type="text" name="NAME" />
        <input type="text" name="TIMESTAMP" />
        <button>Vygenerovať HMAC</button>
        <input ref={hmacRef} disabled type="text" name="HMAC" />
      </form>
    </Container>
  )
}

PaymentTesting.Layout = Layout
