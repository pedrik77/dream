import { Product } from '@lib/products'
import { useEffect, useState } from 'react'
import { useProducts } from './products'

export interface Winner {
  product: Product
}

export const useWinners = (): Winner[] => {
  const [winners, setWinners] = useState<Winner[]>([])

  const products = useProducts({ onlyActive: false })

  console.log({ products })

  useEffect(() => {
    setWinners(products.map((product) => ({ product })))
  }, [products])

  return winners
}
