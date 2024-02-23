import { Button, Container, Input, Text } from '@components/ui'
import { FormEvent, useState } from 'react'
import {
  calculateHmac,
  concatStringToSignForRequest,
  concatStringToSignForResult,
  ecdsaPublicKeys,
  PaymentRequestModel,
  PaymentResultModel,
} from '@lib/payments'
import { Layout } from '@components/common'
import { api } from '@lib/api/rest'

const getInput = (form: HTMLFormElement, name: string) =>
  form.querySelector(`[name=${name}]`) as HTMLInputElement

export default function PaymentTesting() {
  const defaultPublicKey =
    '-----BEGIN PUBLIC KEY-----\n' +
    'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEozvFM1FJP4igUQ6kP8ofnY7ydIWksMDk1IKXyr/TRDoX4sTMmmdiIrpmCZD4CLDtP0j2LfD7saSIc8kZUwfILg==\n' +
    '-----END PUBLIC KEY-----'

  const [hmac, setHmac] = useState('')
  const [hmacValid, setHmacValid] = useState<boolean | null>(null)
  const [ecdsaValid, setEcdsaValid] = useState<boolean | null>(null)

  const handleRequestSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement

    const paymentReqModel: PaymentRequestModel = {
      mid: getInput(form, 'MID').value,
      amt: getInput(form, 'AMT').value,
      curr: getInput(form, 'CURR').value,
      vs: getInput(form, 'VS').value,
      rurl: getInput(form, 'RURL').value,
      ipc: getInput(form, 'IPC').value,
      name: getInput(form, 'NAME').value,
      timestamp: getInput(form, 'TIMESTAMP').value,
    }
    const hmacKey = getInput(form, 'HMACKey').value
    const hmac = calculateHmac(
      hmacKey,
      concatStringToSignForRequest(paymentReqModel)
    )
    setHmac(hmac)
  }

  const handleResponseSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement

    const paymentResultModel: PaymentResultModel = {
      amt: getInput(form, 'AMT_RES').value,
      curr: getInput(form, 'CURR_RES').value,
      vs: getInput(form, 'VS_RES').value,
      txn: getInput(form, 'TXN_RES').value,
      res: getInput(form, 'RES_RES').value,
      ac: getInput(form, 'AC_RES').value,
      cc: getInput(form, 'CC_RES').value,
      tres: getInput(form, 'TRES_RES').value,
      cid: getInput(form, 'CID_RES').value,
      rc: getInput(form, 'RC_RES').value,
      tid: getInput(form, 'TID_RES').value,
      timestamp: getInput(form, 'TIMESTAMP_RES').value,
      hmac: getInput(form, 'HMAC_RES').value,
      ecdsaKey: getInput(form, 'ECDSA_KEY_RES').value,
      ecdsa: getInput(form, 'ECDSA_RES').value,
    }
    const stringToSign = concatStringToSignForResult(paymentResultModel)
    const hmacKey = getInput(form, 'HMACKey_RES').value
    const hmac = calculateHmac(hmacKey, stringToSign)
    setHmacValid(hmac === paymentResultModel.hmac)
    const stringToVerify = stringToSign + hmac
    const ecdsaPublicKeyToUse = paymentResultModel.ecdsaKey
      ? ecdsaPublicKeys[+paymentResultModel.ecdsaKey - 1]
      : defaultPublicKey
    const ecdsaVerificationSuccessful = await api.get('/pay/test-check-ecdsa', {
      params: {
        stringToVerify: stringToVerify,
        ecdsa: paymentResultModel.ecdsa,
        ecdsaPublicKey: ecdsaPublicKeyToUse,
      },
    })
    setEcdsaValid(ecdsaVerificationSuccessful.data)
  }

  return (
    <Container>
      <Text variant="pageHeading">Form</Text>

      <div className="flex justify-between">
        <form className="flex flex-col" onSubmit={handleRequestSubmit}>
          <Input defaultValue="9999" type="text" name="MID">
            MID
          </Input>
          <Input defaultValue="1234.50" type="text" name="AMT">
            AMT
          </Input>
          <Input defaultValue="978" type="text" name="CURR">
            CURR
          </Input>
          <Input defaultValue="1111" type="text" name="VS">
            VS
          </Input>
          <Input
            defaultValue="https://moja.tatrabanka.sk/cgi-bin/e-commerce/start/example.jsp"
            type="text"
            name="RURL"
          >
            RURL
          </Input>
          <Input defaultValue="1.2.3.4" type="text" name="IPC">
            IPC
          </Input>
          <Input defaultValue="Jan Pokusny" type="text" name="NAME">
            NAME
          </Input>
          <Input defaultValue="01092014125505" type="text" name="TIMESTAMP">
            TIMESTAMP
          </Input>
          <Input
            defaultValue="31323334353637383930313233343536373839303132333435363738393031323132333435363738393031323334353637383930313233343536373839303132"
            type="text"
            name="HMACKey"
          >
            HMAC Key
          </Input>
          <Button>Vygenerovať HMAC</Button>
          <Input value={hmac} readOnly type="text" name="HMAC">
            HMAC
          </Input>
        </form>
        <form className="flex flex-col" onSubmit={handleResponseSubmit}>
          <Input defaultValue="1234.50" type="text" name="AMT_RES">
            AMT
          </Input>
          <Input defaultValue="978" type="text" name="CURR_RES">
            CURR
          </Input>
          <Input defaultValue="1111" type="text" name="VS_RES">
            VS
          </Input>
          <Input defaultValue="" type="text" name="TXN_RES">
            TXN
          </Input>
          <Input defaultValue="OK" type="text" name="RES_RES">
            RES
          </Input>
          <Input defaultValue="123456" type="text" name="AC_RES">
            AC
          </Input>
          <Input defaultValue="" type="text" name="TRES_RES">
            TRES
          </Input>
          <Input defaultValue="" type="text" name="CID_RES">
            CID
          </Input>
          <Input defaultValue="" type="text" name="CC_RES">
            CC
          </Input>
          <Input defaultValue="" type="text" name="RC_RES">
            RC
          </Input>
          <Input defaultValue="1" type="text" name="TID_RES">
            TID
          </Input>
          <Input defaultValue="01092014125505" type="text" name="TIMESTAMP_RES">
            TIMESTAMP
          </Input>
          <Input
            defaultValue="8df96c2603831046d0e3502cab1ddb7d9b629d7f09a44aee7abbec0be3f2d971"
            type="text"
            name="HMAC_RES"
          >
            HMAC
          </Input>
          <Input defaultValue="" type="text" name="ECDSA_KEY_RES">
            ECDSA KEY (Nechať prázdne, aby sa použil testovací kľúč)
          </Input>
          <Input
            defaultValue="3044022020410f62c230bd0ba64a5a3f5086711d6d452accab4e81662e4ce07863616790022024ee3c2aad8f2100d31b25acd3ed03c6813849f4608fef1a7f33335142c6bfa3"
            type="text"
            name="ECDSA_RES"
          >
            ECDSA
          </Input>
          <Input
            defaultValue="31323334353637383930313233343536373839303132333435363738393031323132333435363738393031323334353637383930313233343536373839303132"
            type="text"
            name="HMACKey_RES"
          >
            HMAC Key
          </Input>
          <Button>Overiť HMAC a ECDSA</Button>
          <Input
            value={hmacValid + ''}
            readOnly
            type="text"
            name="HMAC_VALID_RES"
          >
            HMAC Valid
          </Input>
          <Input
            value={ecdsaValid + ''}
            readOnly
            type="text"
            name="ECDSA_VALID_RES"
          >
            ECDSA Valid
          </Input>
        </form>
      </div>
    </Container>
  )
}

PaymentTesting.Layout = Layout
