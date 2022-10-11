import { api } from './api'
import { ContactFormData } from './schemas/contact'

export const CONTACT_FORM_CMS_ID = 'email__contact-form'
export const SIGN_UP_CMS_ID = 'email__sign-up'
export const RESET_PASSWORD_CMS_ID = 'email__reset-password'
export const VERIFICATION_CMS_ID = 'email__verification'
export const ORDER_CREATED_CMS_ID = 'email__order-created'
export const UNPAID_ORDER_CREATED_CMS_ID = 'email__unpaid-order-created'
export const PRODUCT_CLOSE_CMS_ID = 'email__product-close'
export const WINNER_ANNOUNCEMENT_CMS_ID = 'email__winner-announcement'

export const templates = {
  [CONTACT_FORM_CMS_ID]: [
    'firstname',
    'lastname',
    'email',
    'subject',
    'message',
  ],
  [SIGN_UP_CMS_ID]: ['firstname', 'action'],
  [RESET_PASSWORD_CMS_ID]: ['firstname', 'action'],
  [VERIFICATION_CMS_ID]: ['firstname', 'action'],
  [ORDER_CREATED_CMS_ID]: ['firstname', 'action'],
  [UNPAID_ORDER_CREATED_CMS_ID]: ['firstname', 'action'],
  [PRODUCT_CLOSE_CMS_ID]: ['firstname', 'action'],
  [WINNER_ANNOUNCEMENT_CMS_ID]: ['firstname', 'action'],
}

export async function sendVerificationEmail(email: string) {
  const { data } = await api.post('/email/verification', { email })
  return data === 'ok'
}

export async function sendOrderCreatedEmail(orderUuid: string) {
  const { data } = await api.post('/email/order-created', { orderUuid })
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

export function getActionButton(action: string, buttonText: string) {
  return `<a href="${action}" style="background-color: #ff0000; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 20px;">${buttonText}</a>`
}
