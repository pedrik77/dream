import { api } from './api'

export const ORDER_CREATED_CMS_ID = 'email__order-created'
export const VERIFICATION_CMS_ID = 'email__verification'

export async function sendEmailVerificationEmail(email: string) {
  const { data } = await api.post('email/verification', { email })
  return data === 'ok'
}

export async function sendOrderCreatedEmail(orderUuid: string) {
  const { data } = await api.post('/email/order-created', { order: orderUuid })
  return data === 'ok'
}

export function processPlaceholders(
  template: string,
  data: Record<string, any>
) {
  return Object.entries(data).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`#${key}#`, 'g'), value),
    template
  )
}
