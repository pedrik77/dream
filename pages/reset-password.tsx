import { Layout } from '@components/common'
import { Button, Container, Input, Text } from '@components/ui'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useTranslation } from 'react-i18next'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { token } = query

  return {
    props: { token },
  }
}

export default function ResetPassword({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation()

  return (
    <Container>
      <div className="max-w-2xl mx-8 sm:mx-auto py-20 flex flex-col items-center justify-center fit">
        <div className="w-4/5 h-2/5 display-block mb-4">
          <form
            action="/api/auth/reset-password"
            method="post"
            className="my-4 md:my-8 py-4 md:py-8 flex flex-col gap-8"
          >
            <fieldset className="flex flex-col md:flex-row gap-4">
              <input type="hidden" name="token" value={token} />
              <Input
                variant="ghost"
                className="py-3"
                labelClass="flex-grow"
                name="password"
                type={'password'}
                required
              >
                {t('password')}
              </Input>
            </fieldset>
            <Button>{t('reset')}</Button>
          </form>
        </div>
      </div>
    </Container>
  )
}

ResetPassword.Layout = Layout
