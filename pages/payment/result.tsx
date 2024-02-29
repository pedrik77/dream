import { Container, Text } from '@components/ui'
import { GetServerSideProps } from 'next'
import {
  calculateHmac,
  concatStringToSignForResult,
  ecdsaPublicKeys,
  hmacKeyEnv,
  PaymentResultModel,
  verifyEcdsa
} from '@lib/payments'
import { Layout } from '@components/common'
import Link from 'next/link'

export default function PaymentResult({
                                        paymentSuccessful,
                                        hmacVerificationSuccessful,
                                        ecdsaVerificationSuccessful
                                      }: {
  paymentSuccessful: boolean
  hmacVerificationSuccessful: boolean
  ecdsaVerificationSuccessful: boolean
}) {
  console.log('Payment successful', paymentSuccessful)
  console.log('HMAC successful', hmacVerificationSuccessful)
  console.log('ECDSA successful', ecdsaVerificationSuccessful)
  return (
    <Container>
      <div className="max-w-2xl mx-8 sm:mx-auto py-20 flex flex-col items-center justify-center fit">
        <Link href={'/'}>
          {paymentSuccessful ?
            <Text variant="heading">Platba prebehla úspešne :)</Text> :
            <Text variant="heading">Nastala chyba pri platbe :(</Text>}
        </Link>
      </div>
    </Container>
  )
}

PaymentResult.Layout = Layout

export const getServerSideProps: GetServerSideProps = async ({
                                                               query,
                                                               req
                                                             }) => {
  const paymentResultModel: PaymentResultModel = {
    amt: query.AMT as string,
    curr: query.CURR as string,
    vs: query.VS as string,
    txn: query.TXN as string,
    res: query.RES as string,
    ac: query.AC as string,
    tres: query.TRES as string,
    cid: query.CID as string,
    cc: query.CC as string,
    rc: query.RC as string,
    tid: query.TID as string,
    timestamp: query.TIMESTAMP as string,
    hmac: query.HMAC as string,
    ecdsaKey: query.ECDSA_KEY as string,
    ecdsa: query.ECDSA as string
  }
  const stringToSign = concatStringToSignForResult(paymentResultModel)
  const key = hmacKeyEnv()
  const hmac = calculateHmac(key, stringToSign)

  const stringToVerify = stringToSign + hmac
  const ecdsaVerificationSuccessful = verifyEcdsa(
    stringToVerify,
    paymentResultModel.ecdsa,
    ecdsaPublicKeys[+paymentResultModel.ecdsaKey - 1]
  )
  const hmacVerificationSuccessful = hmac === paymentResultModel.hmac
  const paymentSuccessful = (query.RES as string).toLowerCase() === 'ok'
  return {
    props: {
      paymentSuccessful,
      hmacVerificationSuccessful,
      ecdsaVerificationSuccessful
    }
  }
}

// example key: 31323334353637383930313233343536373839303132333435363738393031323132333435363738393031323334353637383930313233343536373839303132
// example query: ?AMT=1234.50&CURR=978&VS=1111&RES=OK&AC=123456&TID=1&TIMESTAMP=01092014125505&HMAC=8df96c2603831046d0e3502cab1ddb7d9b629d7f09a44aee7abbec0be3f2d971&ECDSA_KEY=1&ECDSA=3044022020410f62c230bd0ba64a5a3f5086711d6d452accab4e81662e4ce07863616790022024ee3c2aad8f2100d31b25acd3ed03c6813849f4608fef1a7f33335142c6bfa3

// string to verify from TEST TB portal: 1234.509781111OK123456101092014125505
//                                       1234.509781111OK123456101092014125505

// hmac from TEST TB portal: 8df96c2603831046d0e3502cab1ddb7d9b629d7f09a44aee7abbec0be3f2d971
// own hmac:
