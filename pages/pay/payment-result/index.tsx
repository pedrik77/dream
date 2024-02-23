import { Container } from '@components/ui'
import { GetServerSideProps } from 'next'
import { getOrder } from '@lib/api/shop/orders'
import { calculateHmac, concatStringToSignForResult, PaymentResultModel } from '@lib/payment-util'
import Error from 'next/error'

export default function PaymentResult({result}: {result: string}) {
  return <Container>
    payment-result component and the result is: {result}
  </Container>
}

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
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
    ecdsa: query.ECDSA as string,
  }
  console.log(paymentResultModel)
  const stringToSign = concatStringToSignForResult(paymentResultModel)
  console.log("Own stringToSign", stringToSign)
  const key = "31323334353637383930313233343536373839303132333435363738393031323132333435363738393031323334353637383930313233343536373839303132"
  const hmac = calculateHmac(key, stringToSign)
  const hmacMatches = hmac !== paymentResultModel.hmac
  console.log("hmacMatches", hmacMatches)
  return ({
    props: { result: query.RES }
  })
}

// example key: 31323334353637383930313233343536373839303132333435363738393031323132333435363738393031323334353637383930313233343536373839303132
// example query: ?AMT=1234.50&CURR=978&VS=1111&RES=OK&AC=123456&TID=1&TIMESTAMP=01092014125505&HMAC=8df96c2603831046d0e3502cab1ddb7d9b629d7f09a44aee7abbec0be3f2d971&ECDSA_KEY=1&ECDSA=3044022020410f62c230bd0ba64a5a3f5086711d6d452accab4e81662e4ce07863616790022024ee3c2aad8f2100d31b25acd3ed03c6813849f4608fef1a7f33335142c6bfa3

// string to verify from TEST TB portal: 1234.509781111OK123456101092014125505
//                                       1234.509781111OK123456101092014125505

// hmac from TEST TB portal: 8df96c2603831046d0e3502cab1ddb7d9b629d7f09a44aee7abbec0be3f2d971
// own hmac:
