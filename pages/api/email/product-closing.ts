import { basicShowFormat } from '@lib/api/page/date'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail } from '@lib/mailer'
import { getSingleComponent } from '@lib/api/cms'
import { processPlaceholders, PRODUCT_CLOSE_CMS_ID } from '@lib/emails'
import { getProduct } from '@lib/products'
import { getCustomersPerProduct } from '@lib/orders'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const { productSlug } = req.body

  if (!productSlug) return res.status(400).send('Missing product slug')

  const product = await getProduct(productSlug, { withCmsBlocks: false })

  const template = await getSingleComponent(PRODUCT_CLOSE_CMS_ID)

  const customers = await getCustomersPerProduct(productSlug)

  await Promise.all(
    customers.map(
      (customer) =>
        customer &&
        sendMail(
          {
            address: customer.email,
            name: customer.firstname
              ? `${customer.firstname} ${customer.lastname}`
              : customer.email,
          },
          template.value.subject,
          processPlaceholders(template.value.template, {
            firstname: customer.firstname,
            email: customer.email,
            productName: product.title_1,
            announceDate: basicShowFormat(product.winner_announce_date),
          })
        )
    )
  )

  res.status(200).send('ok')
}
