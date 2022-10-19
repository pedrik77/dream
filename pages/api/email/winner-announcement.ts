import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail } from '@lib/mailer'
import { getSingleComponent } from '@lib/cms'
import {
  getActionButton,
  processPlaceholders,
  WINNER_ANNOUNCEMENT_CMS_ID,
} from '@lib/emails'
import { getProduct } from '@lib/products'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const { productSlug } = req.body

  if (!productSlug) return res.status(400).send('Missing product slug')

  const product = await getProduct(productSlug, { withCmsBlocks: false })

  const template = await getSingleComponent(WINNER_ANNOUNCEMENT_CMS_ID)

  await sendMail(
    { address: 'tulic.peter77@gmail.com', name: 'meh' },
    template.value.subject,
    processPlaceholders(template.value.template, {
      // firstname: customer.firstname,
      // lastname: customer.lastname,
      // email: customer.email,
      action: getActionButton(
        process.env.NEXT_PUBLIC_URL + `/products/${product.slug}`,
        template.value.actionButtonText
      ),
    })
  )

  res.status(200).send('ok')
}
