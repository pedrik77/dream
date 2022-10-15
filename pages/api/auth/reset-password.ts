import { verifyAndResetPassword, verifyUser } from '@lib/auth'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const { token = '', password = '' } = req.body

  try {
    if (!token || !password) throw new Error('missing')

    await verifyAndResetPassword(token, password)
  } catch (e: any) {
    res.redirect('/message?type=reset-password&status=' + e.message)
    return
  }

  res.redirect('/message?type=reset-password&status=success')
}
