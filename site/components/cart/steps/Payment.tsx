import { Button, Container, Text } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { useShopContext } from '@lib/shop'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

export default function Payment({ onNext = () => {}, onPrev = () => {} }) {
  const { total, placeOrder, clearCart } = useShopContext()

  const handleNext = async () => {
    placeOrder()
      .then(async () => {
        flash('Vaše objednávka bola úspešne odoslaná', 'success')
        await clearCart()
        onNext()
      })
      .catch(handleErrorFlash)
  }

  return (
    <Container>
      <div className="flex justify-end items-center my-8 gap-4">
        <a href="#" onClick={onPrev} className="underline">
          Spat
        </a>
        <Button className="w-36" onClick={handleNext}>
          Zaplatit
        </Button>
      </div>
      <div className="flex justify-center my-12">
        <Text variant="pageHeading">Cash {total} eur</Text>
      </div>
    </Container>
  )
}
