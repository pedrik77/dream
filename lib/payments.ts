import crypto from 'crypto'
import process from 'process'

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

export const ecdsaPublicKeys = [
  '-----BEGIN PUBLIC KEY-----\n' +
  'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEaq6djyzkpHdX7kt8DsSt6IuSoXjp\n' +
  'WVlLfnZPoLaGKc/2BSfYQuFIO2hfgueQINJN3ZdujYXfUJ7Who+XkcJqHQ==\n' +
  '-----END PUBLIC KEY-----',
  '-----BEGIN PUBLIC KEY-----\n' +
  'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE+Y5mYZL/EEY9zGji+hrgGkeoyccK\n' +
  'D0/oBoSDALHc9+LXHKsxXiEV7/h6d6+fKRDb6Wtx5cMzXT9HyY+TjPeuTg==\n' +
  '-----END PUBLIC KEY-----',
  '-----BEGIN PUBLIC KEY-----\n' +
  'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEkvgJ6sc2MM0AAFUJbVOD/i34YJJ8\n' +
  'ineqTN+DMjpI5q7fQNPEv9y2z/ecPl8qPus8flS4iLOOxdwGoF1mU9lwfA==\n' +
  '-----END PUBLIC KEY-----'
]

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

export function verifyEcdsa(stringToVerify: string, ecdsa: string, ecdsaKey: string): boolean {
  const crypto = require('crypto');

  const pemPublicKey = "-----BEGIN PUBLIC KEY-----\n" +
    "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEozvFM1FJP4igUQ6kP8ofnY7y\n" +
    "dIWksMDk1IKXyr/TRDoX4sTMmmdiIrpmCZD4CLDtP0j2LfD7saSIc8kZUwfILg==\n" +
    "-----END PUBLIC KEY-----"
  const publicKeyObject = crypto.createPublicKey({
    key: pemPublicKey,
    format: 'pem'
  });

  const ecdsaSign = crypto.createVerify('SHA256');
  ecdsaSign.update(Buffer.from(stringToVerify, 'utf-8'));

  return ecdsaSign.verify(publicKeyObject, Buffer.from(ecdsa, 'hex'));
}


export function hmacKeyEnv(): string {
  const paymentHmacKey = process.env.PAYMENT_HMAC_KEY
  if (!paymentHmacKey) throw Error('PAYMENT_HMAC_KEY environment variable has to be set')
  return paymentHmacKey
}
