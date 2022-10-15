import { Product } from '@lib/products'
import React, { useEffect, useMemo } from 'react'
import s from './ProductBadge.module.css'
import cn from 'clsx'

interface ProductBadgeProps {
  product: Product
}

const DAYS_FOR_NEW = 7
const DAYS_BEFORE_CLOSING = 14

type BadgeType = 'new' | 'closing' | 'pending' | 'closed' | 'none'

export const ProductBadge: React.FC<ProductBadgeProps> = ({ product }) => {
  const [badge, daysLeft = 0] = useBadge(product)

  const className = cn(s.badge, {
    [s.new]: badge === 'new',
    [s.beforeClose]: badge === 'closing',
    [s.winnerPending]: badge === 'pending',
    [s.closed]: badge === 'closed',
  })

  if (badge === 'none') return null

  return (
    <div className={className}>
      {badge === 'new' && 'Nové'}
      {badge === 'closing' &&
        `${remains(daysLeft)} ${daysLeft} ${days(daysLeft)}`}
      {badge === 'pending' && 'Žrebujeme výhercu'}
      {badge === 'closed' && 'Pozrite si výhercu'}
    </div>
  )
}

const useBadge = (product: Product): [BadgeType, number?] =>
  useMemo(() => {
    if (!!product.winner_order) return ['closed']

    const now = new Date()
    const closingDate = new Date(product.closing_date * 1000)

    if (now > closingDate) return ['pending']

    const diffClosing = Math.floor(
      (closingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffClosing <= DAYS_BEFORE_CLOSING) return ['closing', diffClosing]

    const diffNew = Math.floor(
      (new Date(product.created_date * 1000).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24)
    )

    if (Math.abs(diffNew) <= DAYS_FOR_NEW) return ['new']

    return ['none']
  }, [product])

const remains = (days: number) => {
  if (days > 1 && days < 5) return 'Zostávajú'
  return 'Zostáva'
}

const days = (days: number) => {
  if (days === 1) return 'deň'
  if (days > 1 && days < 5) return 'dni'
  return 'dní'
}
