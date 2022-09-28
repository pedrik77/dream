import nodemailer from 'nodemailer'

const host = process.env.MAIL_HOST
const port = +(process.env.MAIL_PORT || 0)
const user = process.env.MAIL_USER
const pass = process.env.MAIL_PASSWORD

const name = process.env.MAIL_FROM_NAME
const address = process.env.MAIL_FROM

const transporter = nodemailer.createTransport(
  {
    host,
    port,
    secure: true,
    auth: {
      user,
      pass,
    },
  },
  { from: { name, address } }
)

export const sendMail = async (
  to: string | { name: string; address: string },
  subject: string,
  html: string
) => {
  const info = await transporter.sendMail({
    to,
    subject,
    html,
  })
  console.log('Message sent: %s', info.messageId)
}
