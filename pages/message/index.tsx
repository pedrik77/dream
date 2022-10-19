import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useTranslation } from 'react-i18next'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { type = '', status = '' } = query

  return {
    props: { type, status },
  }
}

export default function Verified({
  type,
  status,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation()

  const titleKey = `messages.${type}.${status}.title`
  const messageKey = `messages.${type}.${status}.text`

  const title = t(titleKey)
  const message = t(messageKey)

  return (
    <Container>
      <div className="max-w-2xl mx-8 sm:mx-auto py-20 flex flex-col items-center justify-center fit">
        <div className="w-4/5 h-2/5 display-block mb-4">
          <Text variant="heading">{title !== titleKey ? title : status}</Text>
          <Text className="text-lg">
            {message !== messageKey ? message : ''}
          </Text>
        </div>
      </div>
    </Container>
  )
}

Verified.Layout = Layout
