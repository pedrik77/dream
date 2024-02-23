import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("inside payment result")
  console.log("query param RURL:", req.query.RURL)
  res.status(200).send('ok')
}
