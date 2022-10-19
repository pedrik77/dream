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

const common = ['firstname', 'lastname', 'email']

export const templates = {
  [CONTACT_FORM_CMS_ID]: ['subject', 'message', ...common],
  [SIGN_UP_CMS_ID]: ['action', ...common],
  // [RESET_PASSWORD_CMS_ID]: ['action', ...common],
  [VERIFICATION_CMS_ID]: ['action', ...common],
  [ORDER_CREATED_CMS_ID]: ['orderInfo', ...common],
  [UNPAID_ORDER_CREATED_CMS_ID]: ['paymentDetails', 'orderInfo', ...common],
  [PRODUCT_CLOSE_CMS_ID]: ['productName', 'announceDate', ...common],
  [WINNER_ANNOUNCEMENT_CMS_ID]: ['productName', 'action', ...common],
}

export async function sendVerificationEmail(email: string) {
  const { data } = await api.post('/email/verification', { email })
  return data === 'ok'
}

export async function sendResetPasswordEmail(email: string) {
  const { data } = await api.post('/email/reset-password', { email })
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
  return `<a href="${action}" style="min-width: 5rem; text-align: center; margin: 20px auto 0; background-color: #f5b612; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">${buttonText}</a>`
}
