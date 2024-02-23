import { Container, Input } from '@components/ui'
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
      <div className="flex gap-8">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <Input type="text" name="MID">
            MID
          </Input>
          <Input type="text" name="AMT">
            AMT
          </Input>
          <Input type="text" name="CURR">
            CURR
          </Input>
          <Input type="text" name="VS">
            VS
          </Input>
          <Input type="text" name="RURL">
            RURL
          </Input>
          <Input type="text" name="IPC">
            IPC
          </Input>
          <Input type="text" name="NAME">
            NAME
          </Input>
          <Input type="text" name="TIMESTAMP">
            TIMESTAMP
          </Input>
          <button>Vygenerovať HMAC</button>
          <Input ref={hmacRef} disabled type="text" name="HMAC">
            HMAC
          </Input>
        </form>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <Input type="text" name="MID">
            MID
          </Input>
          <Input type="text" name="AMT">
            AMT
          </Input>
          <Input type="text" name="CURR">
            CURR
          </Input>
          <Input type="text" name="VS">
            VS
          </Input>
          <Input type="text" name="RURL">
            RURL
          </Input>
          <Input type="text" name="IPC">
            IPC
          </Input>
          <Input type="text" name="NAME">
            NAME
          </Input>
          <Input type="text" name="TIMESTAMP">
            TIMESTAMP
          </Input>
          <button>Vygenerovať HMAC</button>
          <Input ref={hmacRef} disabled type="text" name="HMAC">
            HMAC
          </Input>
        </form>
      </div>
    </Container>
  )
}

PaymentTesting.Layout = Layout
