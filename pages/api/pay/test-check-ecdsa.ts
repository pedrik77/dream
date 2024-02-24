import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyEcdsa } from '@lib/payments'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stringToVerify = req.query.stringToVerify as string
  const ecdsa = req.query.ecdsa as string
  const ecdsaPublicKey = req.query.ecdsaPublicKey as string
  const verificationSuccessful = verifyEcdsa(stringToVerify, ecdsa, ecdsaPublicKey)
  res.status(200).send(verificationSuccessful)
}
