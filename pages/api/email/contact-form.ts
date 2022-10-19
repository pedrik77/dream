import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail } from '@lib/mailer'
import { getSingleComponent } from '@lib/cms'
import { CONTACT_FORM_CMS_ID, processPlaceholders } from '@lib/emails'

const recipient = process.env.MAIL_CONTACT_RECIPIENT as string

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const { firstname, lastname, email, subject, message } = req.body

  const template = await getSingleComponent(CONTACT_FORM_CMS_ID)

  await sendMail(
    recipient,
    template.value.subject,
    processPlaceholders(template.value.template, {
      firstname,
      lastname,
      email,
      subject,
      message,
    })
  )

  res.status(200).send('ok')
}
