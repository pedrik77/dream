import { Button, Container, Input, Text } from '@components/ui'
import { TextareaAutosize } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function ContactForm() {
  const { t } = useTranslation()

  return (
    <Container>
      <Text variant="myHeading" className="text-center">
        {t('contact.title')}
      </Text>
      <form>
        <fieldset>
          <label>
            {t('contact.name')}
            <Input variant="ghost" />
          </label>
          <label>{t('contact.surname')}</label>
        </fieldset>
        <fieldset>
          <label>
            Email
            <Input type="email" />
          </label>
          <label>
            {t('contact.subject')}
            <Input />
          </label>
        </fieldset>
        <fieldset>
          <label>
            {t('contact.message')}
            <br />
            <TextareaAutosize minRows={6} className="w-full" />
          </label>
        </fieldset>
        <Button>{t('send')}</Button>
      </form>
    </Container>
  )
}
