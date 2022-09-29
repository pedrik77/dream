import { getOrder, setOrder } from '@lib/orders'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail } from '@lib/mailer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const orderUuid = req.body.order

  if (!orderUuid) return res.status(400).send('Missing order UUID')

  const order = await getOrder(orderUuid)

  if (order.mail_sent) return res.status(400).send('Mail already sent')

  setOrder({ ...order, mail_sent: true })

  await sendMail(
    {
      name: order.customer.fullname,
      address: order.customer.email,
    },
    'Objednávka prijatá',
    `Hey <b>${
      order.customer.fullname
    }</b>,<br><br> totos chcel? <br><br> <ul>${order.items.map(
      (item) => `<li>${item.product.title_1}</li>`
    )}</ul>`
  )

  res.status(200).send('ok')
}
