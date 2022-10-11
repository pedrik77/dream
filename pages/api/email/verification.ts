import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail } from '@lib/mailer'
import { getSingleComponent } from '@lib/cms'
import {
  getActionButton,
  processPlaceholders,
  VERIFICATION_CMS_ID,
} from '@lib/emails'
import { getCustomerProfile, setCustomerProfile } from '@lib/auth'
import { v4 as uuid4 } from 'uuid'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const { email } = req.body

  if (!email) return res.status(400).send('Missing email')

  const customer = await getCustomerProfile(email)

  if (customer.verified) return res.status(400).send('User already verifid')

  const verificationToken = uuid4()

  setCustomerProfile({ ...customer, verificationToken })

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
      action: getActionButton(
        process.env.NEXT_PUBLIC_API_URL + '/verify/' + verificationToken,
        template.value.actionButtonText
      ),
    })
  )

  res.status(200).send('ok')
}
