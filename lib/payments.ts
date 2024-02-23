import crypto from 'crypto'


export type PaymentRequestModel = {
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

export type PaymentResultModel = {
  amt: string,
  curr: string,
  vs: string,
  txn?: string,
  res: string,
  ac?: string,
  tres?: string,
  cid?: string,
  cc?: string,
  rc?: string,
  tid?: string,
  timestamp: string,
  hmac?: string,
  ecdsaKey: string,
  ecdsa: string
}

export function hexToBytes(hex: string) {
  const bytes = []
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16))
  }
  return new Uint8Array(bytes)
}

export function bytesToHex({ bytes }: { bytes: Uint8Array }) {
  return Array.from(bytes, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2)
  }).join('')
}

export function calculateHmac(key: string, stringToSign: string) {
  const keyBytes = hexToBytes(key)
  const hmac = crypto.createHmac('sha256', keyBytes)
  hmac.update(stringToSign)
  const hmacBin = hmac.digest()
  return bytesToHex({ bytes: hmacBin })
}


export function concatStringToSignForRequest(model: PaymentRequestModel): string {
  return `${model.mid}${model.amt}${model.curr}${model.vs}${model.rurl}${model.ipc}${model.name}${model.timestamp}`
}

export function concatStringToSignForResult(model: PaymentResultModel): string {
  return `${model.amt}${model.curr}${model.vs}${model.txn || ''}${model.res}${model.ac || ''}${model.tres || ''}${model.cid || ''}${model.cc || ''}${model.rc || ''}${model.tid || ''}${model.timestamp}`
}
