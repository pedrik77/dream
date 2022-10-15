import { Layout } from '@components/common'
import { Container, Text } from '@components/ui'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useTranslation } from 'react-i18next'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { token } = query

  return {
    props: {},
  }
}

export default function ResetPassword({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  const { t } = useTranslation()

  return (
    <Container>
      <div className="max-w-2xl mx-8 sm:mx-auto py-20 flex flex-col items-center justify-center fit">
        <div className="w-4/5 h-2/5 display-block mb-4"></div>
      </div>
    </Container>
  )
}

ResetPassword.Layout = Layout
