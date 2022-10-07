import { getOrder, setOrder } from '@lib/orders'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail } from '@lib/mailer'
import { getSingleComponent } from '@lib/cms'
import { ORDER_CREATED_CMS_ID, processPlaceholders } from '@lib/emails'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const { orderUuid } = req.body

  if (!orderUuid) return res.status(400).send('Missing order UUID')

  const order = await getOrder(orderUuid)

  if (order.mail_sent) return res.status(400).send('Mail already sent')

  const template = await getSingleComponent(ORDER_CREATED_CMS_ID)

  await sendMail(
    {
      name: order.customer.fullname,
      address: order.customer.email,
    },
    template.value.subject,
    processPlaceholders(template.value.template, {
      name: order.customer.fullname,
    })
  )

  await setOrder({ ...order, mail_sent: true })

  res.status(200).send('ok')
}
