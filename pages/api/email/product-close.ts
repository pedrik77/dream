import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail } from '@lib/mailer'
import { getSingleComponent } from '@lib/cms'
import { processPlaceholders, PRODUCT_CLOSE_CMS_ID } from '@lib/emails'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const template = await getSingleComponent(PRODUCT_CLOSE_CMS_ID)

  await sendMail(
    'tulic.peter77@gmail.com',
    template.value.subject,
    template.value.template
  )

  res.status(200).send('ok')
}
