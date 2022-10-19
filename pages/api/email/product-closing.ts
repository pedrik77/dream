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
    { address: 'tulic.peter77@gmail.com', name: 'meh' },
    template.value.subject,
    processPlaceholders(template.value.template, {
      name: 'testovy mail, tunak text dajak jeeeeb',
    })
  )

  res.status(200).send('ok')
}
