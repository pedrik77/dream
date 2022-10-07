import { api } from './api'
import { ContactFormData } from './zod-schemas'

export const SIGN_UP_CMS_ID = 'email__sign-up'
export const RESET_PASSWORD_CMS_ID = 'email__reset-password'
export const VERIFICATION_CMS_ID = 'email__verification'
export const CONTACT_FORM_CMS_ID = 'email__contact-form'
export const ORDER_CREATED_CMS_ID = 'email__order-created'
export const UNPAID_ORDER_CREATED_CMS_ID = 'email__unpaid-order-created'
export const PRODUCT_CLOSE_CMS_ID = 'email__product-close'
export const WINNER_ANNOUNCEMENT_CMS_ID = 'email__winner-announcement'

export const templates = {
  [SIGN_UP_CMS_ID]: ['name'],
  [RESET_PASSWORD_CMS_ID]: ['name'],
  [VERIFICATION_CMS_ID]: ['name'],
  [CONTACT_FORM_CMS_ID]: ['name', 'surname', 'email', 'subject', 'message'],
  [ORDER_CREATED_CMS_ID]: ['name'],
  [UNPAID_ORDER_CREATED_CMS_ID]: ['name'],
  [PRODUCT_CLOSE_CMS_ID]: ['name'],
  [WINNER_ANNOUNCEMENT_CMS_ID]: ['name'],
}

export async function sendEmailVerificationEmail(email: string) {
  const { data } = await api.post('/email/verification', { email })
  return data === 'ok'
}

export async function sendOrderCreatedEmail(orderUuid: string) {
  const { data } = await api.post('/email/order-created', { order: orderUuid })
  return data === 'ok'
}

export async function sendContactFormEmail(contactData: ContactFormData) {
  const { data } = await api.post('/email/contact-form', contactData)
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
