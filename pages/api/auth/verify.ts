import { verifyUser } from '@lib/auth'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token = '' } = req.query

  try {
    await verifyUser(token as string)
  } catch (e: any) {
    res.redirect('/message?type=verify&status=' + e.message)
    return
  }

  res.redirect('/message?type=verify&status=success')
}
