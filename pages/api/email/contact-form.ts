import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail } from '@lib/mailer'
import { getSingleComponent } from '@lib/cms'
import { CONTACT_FORM_CMS_ID, processPlaceholders } from '@lib/emails'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const template = await getSingleComponent(CONTACT_FORM_CMS_ID)

  await sendMail(
    'tulic.peter77@gmail.com',
    // 'contact@vysnivaj.si',
    template.value.subject,
    processPlaceholders(template.value.template, {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    })
  )

  res.status(200).send('ok')
}
