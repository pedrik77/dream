import { Button, Container, Input, Text } from '@components/ui'
import { TextareaAutosize } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function ContactForm() {
  const { t } = useTranslation()

  return (
    <Container className="my-10">
      <Text variant="myHeading" className="text-center my-8">
        {t('contact.title')}
      </Text>
      <form className="flex flex-col gap-4 justify-center max-w-2xl mx-auto">
        <fieldset className="flex flex-col md:flex-row gap-4">
          <Input variant="ghost" className="py-3" labelClass="flex-grow">
            {t('contact.name')}
          </Input>
          <Input variant="ghost" className="py-3" labelClass="flex-grow">
            {t('contact.surname')}
          </Input>
        </fieldset>
        <fieldset className="flex flex-col gap-4">
          <Input type="email" variant="ghost" className="py-3">
            Email
          </Input>
          <Input variant="ghost" className="py-3">
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
            />
          </label>
        </fieldset>
        <fieldset className="flex gap-4 justify-center my-8">
          <Button className="max-w-fit">{t('send')}</Button>
          <Button variant="ghost" type="button">
            {t('cancel')}
          </Button>
        </fieldset>
      </form>
    </Container>
  )
}
