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
    <Container className="col-span-full px-0">
      <div className="flex justify-end items-center my-8 gap-4">
        <Button className="w-36" onClick={onPrev} variant="ghost">
          Späť
        </Button>
        <Button className="w-36" onClick={handleNext}>
          Pokračovať
        </Button>
      </div>
      <div className="flex justify-center my-12">
        <Text variant="pageHeading">Spolu {total} €</Text>
      </div>
    </Container>
  )
}
