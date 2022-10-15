import { createToken, getCustomerProfile } from '@lib/auth'
import { getSingleComponent } from '@lib/cms'
import {
  getActionButton,
  processPlaceholders,
  RESET_PASSWORD_CMS_ID,
} from '@lib/emails'
import { sendMail } from '@lib/mailer'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') return res.status(405).send('Method not allowed')

    const { email } = req.body

    if (!email) throw new Error('Missing email')

    const customer = await getCustomerProfile(email)

    if (!customer) throw new Error('User not found')

    const token = await createToken(customer.email)

    const template = await getSingleComponent(RESET_PASSWORD_CMS_ID)

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
          process.env.NEXT_PUBLIC_URL + '/reset-password?token=' + token,
          template.value.actionButtonText
        ),
      })
    )

    res.status(200).send('ok')
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
}
