import { verify } from '@lib/auth'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token = '' } = req.query

  const result = await verify(token as string)

  res.redirect('/verified?error=' + +!result)
}
