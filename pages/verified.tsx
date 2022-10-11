import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useTranslation } from 'react-i18next'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: { error: query.error },
  }
}

export default function Verified({
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation()

  return (
    <Container>
      <Text variant="sectionHeading">
        {t(`verified.${error == 0 ? 'success' : 'error'}`)}
      </Text>
    </Container>
  )
}

Verified.Layout = Layout
