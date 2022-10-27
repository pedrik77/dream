import List from '@components/blog/List'
import { Layout } from '@components/common'
import { blog, page } from '@lib/api'
import React from 'react'

const { useSubscription } = blog.posts

export default function BlogList() {
  const { data: posts } = useSubscription()

  return (
    <div>
      <List posts={posts} />
    </div>
  )
}

BlogList.Layout = Layout
