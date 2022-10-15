import { verifyUser } from '@lib/auth'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token = '' } = req.query

  const result = await verifyUser(token as string)

  res.redirect('/verified')
}
