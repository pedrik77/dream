import { Button, Container, Input, Text } from '@components/ui'
import { TextareaAutosize } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function ContactForm() {
  const { t } = useTranslation()

  return (
    <Container className="my-10">
      <Text variant="myHeading" className="text-center my-4">
        {t('contact.title')}
      </Text>
      <form className="flex flex-col gap-4 justify-center max-w-2xl mx-auto">
        <fieldset className="flex flex-col gap-4">
          <label>
            {t('contact.name')}
            <Input variant="ghost" />
          </label>
          <label>
            {t('contact.surname')}
            <Input variant="ghost" />
          </label>
        </fieldset>
        <fieldset className="flex flex-col gap-4">
          <label>
            Email
            <Input type="email" variant="ghost" />
          </label>
          <label>
            {t('contact.subject')}
            <Input variant="ghost" />
          </label>
        </fieldset>
        <fieldset className="flex flex-col gap-4">
          <label>
            {t('contact.message')}
            <br />
            <TextareaAutosize
              minRows={6}
              className="w-full border-primary border-1 rounded-md"
            />
          </label>
        </fieldset>
        <Button>{t('send')}</Button>
      </form>
    </Container>
  )
}
