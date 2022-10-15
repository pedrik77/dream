import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail } from '@lib/mailer'
import { getSingleComponent } from '@lib/cms'
import {
  getActionButton,
  processPlaceholders,
  VERIFICATION_CMS_ID,
} from '@lib/emails'
import { createToken, getCustomerProfile } from '@lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const { email } = req.body

  if (!email) return res.status(400).send('Missing email')

  const customer = await getCustomerProfile(email)

  if (customer.verified) return res.status(400).send('User already verifid')

  const token = await createToken(customer.email)

  const template = await getSingleComponent(VERIFICATION_CMS_ID)

  await sendMail(
    {
      name: customer.firstname + ' ' + customer.lastname,
      address: customer.email,
    },
    template.value.subject,
    processPlaceholders(template.value.template, {
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      action: getActionButton(
        process.env.NEXT_PUBLIC_API_URL + '/auth/verify?token=' + token,
        template.value.actionButtonText
      ),
    })
  )

  res.status(200).send('ok')
}
