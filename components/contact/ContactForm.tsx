import { Button, Container, Input, Text } from '@components/ui'
import { ContactFormSchema } from '@lib/zod-schemas'
import { TextareaAutosize } from '@mui/material'
import { FormEventHandler, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  flash,
  handleErrorFlash,
} from '@components/ui/FlashMessage/FlashMessage'
import { sendContactFormEmail } from '@lib/emails'

export default function ContactForm() {
  const { t } = useTranslation()

  const [sending, setSending] = useState(false)

  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const reset = () => {
    setName('')
    setSurname('')
    setEmail('')
    setSubject('')
    setMessage('')
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    const parsed = ContactFormSchema.safeParse({
      name,
      surname,
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
        // reset()
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
            value={name}
            onChange={setName}
          >
            {t('contact.name')}
          </Input>
          <Input
            variant="ghost"
            className="py-3"
            labelClass="flex-grow"
            value={surname}
            onChange={setSurname}
          >
            {t('contact.surname')}
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
              className="w-full border-primary border rounded-md bg-transparent"
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
