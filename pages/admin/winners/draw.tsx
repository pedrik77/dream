import { Layout } from '@components/common'
import AdminLayout from '@components/common/AdminLayout'
import Permit from '@components/common/Permit'
import { PERMISSIONS } from '@lib/auth'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import React from 'react'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      slug: query.product,
    },
  }
}

export default function WinnersDraw({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Permit permission={PERMISSIONS.WINNERS_DRAW} redirect="/admin">
      <AdminLayout>WinnersDraw {slug}</AdminLayout>
    </Permit>
  )
}

WinnersDraw.Layout = Layout
