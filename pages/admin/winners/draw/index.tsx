import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import Permit from '@components/common/Permit'
import { Button, Text } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { confirm } from '@lib/alerts'
import { PERMISSIONS } from '@lib/auth'
import { confetti } from '@lib/confetti'
import { sendWinnerAnnouncementEmail } from '@lib/emails'
import { getOrdersToDraw, OrderToDraw } from '@lib/orders'
import { getProduct, Product, setProduct } from '@lib/products'
import { sleep } from '@lib/sleep'
import { flatten, shuffle } from 'lodash'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const getServerSideProps: GetServerSideProps<{
  product: Product
  orders: OrderToDraw[]
}> = async ({ query }) => {
  const { product: productSlug } = query

  if (!productSlug) return { notFound: true }

  const [product, ordersToDraw] = await Promise.all([
    getProduct(productSlug as string),
    getOrdersToDraw(productSlug as string),
  ])

  const orders = shuffle(
    flatten(
      ordersToDraw.map((order) =>
        Array<OrderToDraw>(Number(order.ticketCount)).fill(order)
      )
    )
  )

  return {
    props: {
      product,
      orders,
    },
  }
}

export default function WinnersDraw({
  product,
  orders,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation()
  const router = useRouter()

  const [drawing, setDrawing] = useState(false)

  const handleDraw = async () => {
    const winner = orders[Math.floor(Math.random() * orders.length)]

    setDrawing(true)

    await sleep(1111)

    confetti()

    const result = await confirm(t('winners.drawn'), {
      confirmButtonText: t('winners.continueToPage'),
      cancelButtonText: t('again'),
      html: `
        <div class="text-center">
          <div class="text-4xl font-bold">${winner.name}</div>
          <div class="text-2xl">${winner.email}</div>
        </div>
      `,
    })

    if (!result) return setDrawing(false)

    await setProduct({ ...product, winner_order: winner.uuid })
      .then(() => flash(t('winners.winnerSelected'), 'success'))
      .catch(handleErrorFlash)

    await sendWinnerAnnouncementEmail(product.slug)

    router.push(`/products/${product.slug}`)
  }

  return (
    <Permit permission={PERMISSIONS.WINNERS_DRAW} redirect="/admin">
      <AdminLayout>
        <Text variant="heading">{t('winners.draw')}</Text>
        <Text variant="sectionHeading">{product.title_1}</Text>

        <Button onClick={handleDraw} disabled={drawing}>
          {t(drawing ? 'winners.drawing' : 'start')}
        </Button>
      </AdminLayout>
    </Permit>
  )
}

WinnersDraw.Layout = Layout
