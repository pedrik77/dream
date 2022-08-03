import { AccountField } from '@components/account/Fields'
import { Button, Container, Input, Text } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { useShopContext } from '@lib/shop'
import { FormControl, InputLabel, Radio, RadioGroup } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { handleInputChange } from 'react-select/dist/declarations/src/utils'

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
      <div className="flex justify-end items-center">
        <div className="flex gap-4 text-2xl font-bold pr-8">
          <span>Spolu:</span>
          <span>{total} €</span>
        </div>
        <div className="flex justify-end items-center my-8 gap-4">
          <Button className="w-36" onClick={onPrev} variant="ghost">
            Späť
          </Button>
          <Button className="w-36" onClick={handleNext}>
            Pokračovať
          </Button>
        </div>
      </div>

      <Container className="max-w-full md:max-w-md lg:max-w-xl">
        <div className="flex justify-center gap-8 my-8">
          <div className="flex gap-4">
            <Radio id="paymentMastercard" checked />
            <label htmlFor="paymentmastercard">
              <div className="w-[100px] h-[75px]">
                <Image
                  alt="mastercard"
                  src="/mastercard.png"
                  height="115"
                  width="180"
                  layout="responsive"
                />
              </div>
            </label>
          </div>

          <div className="flex gap-4">
            <Radio id="paymentVisa" disabled />
            <label htmlFor="paymentVisa">
              <div className="w-[100px] h-[75px]">
                <Image
                  alt="visa"
                  src="/visa.png"
                  height="115"
                  width="180"
                  layout="responsive"
                />
              </div>
            </label>
          </div>

          <div className="flex gap-4">
            <Radio id="paymentPaypal" disabled />
            <label htmlFor="paymentPaypal">
              <div className="w-[100px] h-[75px]">
                <Image
                  alt="paypal"
                  src="/paypal.png"
                  height="115"
                  width="180"
                  layout="responsive"
                />
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col align-baseline gap-4 mt-8 mb-16 px-4">
          <div>
            <label htmlFor="cardNumber" className="cursor-pointer">
              Číslo karty{' '}
            </label>
            <Input variant="ghost" id="cardNumber">
              Číslo karty
            </Input>
          </div>
          <div className="flex gap-4">
            <div className="w-full">
              <label htmlFor="cardholderName" className="cursor-pointer">
                Meno držitela karty
              </label>
              <Input id="cardholderName" variant="ghost" />
            </div>
            <div>
              <label htmlFor="cardExpirationDate" className="cursor-pointer">
                Platnosť karty
              </label>
              <Input id="cardExpirationDate" variant="ghost" />
            </div>
            <div>
              <label htmlFor="cardCVV" className="cursor-pointer">
                CVV
              </label>
              <Input id="cardCVV" variant="ghost" />
            </div>
          </div>
        </div>

        <div className="flex justify-center my-12">
          <Button>Zaplatiť {total} €</Button>
        </div>
      </Container>
    </Container>
  )
}
