import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail } from '@lib/mailer'
import { getSingleComponent } from '@lib/cms'
import { processPlaceholders, VERIFICATION_CMS_ID } from '@lib/emails'
import { getCustomerProfile } from '@lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const { email } = req.body

  if (!email) return res.status(400).send('Missing email')

  const customer = await getCustomerProfile(email)

  if (customer.verified) return res.status(400).send('User already verifid')

  const template = await getSingleComponent(VERIFICATION_CMS_ID)

  await sendMail(
    {
      name: customer.fullname,
      address: customer.email,
    },
    template.value.subject,
    processPlaceholders(template.value.template, {
      name: customer.fullname,
    })
  )

  res.status(200).send('ok')
}
