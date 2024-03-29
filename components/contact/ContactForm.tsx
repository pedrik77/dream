import { Button, Container, Input, Text } from '@components/ui'
import { TextareaAutosize } from '@mui/material'
import { FormEventHandler, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  flash,
  handleErrorFlash,
} from '@components/ui/FlashMessage/FlashMessage'
import { sendContactFormEmail } from '@lib/emails'
import { ContactFormSchema } from '@lib/schemas/contact'

export default function ContactForm() {
  const { t } = useTranslation()

  const [sending, setSending] = useState(false)

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const reset = () => {
    setFirstname('')
    setLastname('')
    setEmail('')
    setSubject('')
    setMessage('')
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    const parsed = ContactFormSchema.safeParse({
      firstname,
      lastname,
      email,
      subject,
      message,
    })

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        flash(issue.message, 'danger')
      })

      return
    }

    setSending(true)

    sendContactFormEmail(parsed.data)
      .then(() => {
        flash(t('contact.success'), 'success')
        reset()
        setSending(false)
      })
      .catch(handleErrorFlash)
  }

  return (
    <Container className="my-10">
      <Text variant="myHeading" className="text-center my-8">
        {t('contact.title')}
      </Text>
      <form
        className="flex flex-col gap-4 justify-center max-w-2xl mx-auto"
        onSubmit={handleSubmit}
      >
        <fieldset className="flex flex-col md:flex-row gap-4">
          <Input
            variant="ghost"
            className="py-3"
            labelClass="flex-grow"
            value={firstname}
            onChange={setFirstname}
          >
            {t('contact.firstname')}
          </Input>
          <Input
            variant="ghost"
            className="py-3"
            labelClass="flex-grow"
            value={lastname}
            onChange={setLastname}
          >
            {t('contact.lastname')}
          </Input>
        </fieldset>
        <fieldset className="flex flex-col gap-4">
          <Input
            type="email"
            variant="ghost"
            className="py-3"
            value={email}
            onChange={setEmail}
          >
            Email
          </Input>
          <Input
            variant="ghost"
            className="py-3"
            value={subject}
            onChange={setSubject}
          >
            {t('contact.subject')}
          </Input>
        </fieldset>
        <fieldset className="flex flex-col gap-4">
          <label>
            {t('contact.message')}
            <br />
            <TextareaAutosize
              minRows={6}
              className="w-full border-primary border active:border active:border-secondary active:outline-none focus-visible:outline-none focus-visible:border focus-visible:border-secondary rounded-md bg-transparent px-6 py-4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
        </fieldset>
        <fieldset className="flex gap-4 justify-center my-8">
          <Button className="max-w-fit" disabled={sending}>
            {sending ? t('sending') : t('send')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={reset}
            disabled={sending}
          >
            {t('cancel')}
          </Button>
        </fieldset>
      </form>
    </Container>
  )
}
