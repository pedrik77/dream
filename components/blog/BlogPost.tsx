import { Container, Text } from '@components/ui'
import { Post } from '@lib/api/blog/posts'
import { basicShowFormat } from '@lib/api/page/date'
import React from 'react'

interface PostProps {
  post: Post
}

export default function BlogPost({ post }: PostProps) {
  return (
    <Container>
      <Text variant="pageHeading">{post.title}</Text>

      <img src={post.image?.src} alt="" />

      <p>{basicShowFormat(post.published_date)}</p>

      <p dangerouslySetInnerHTML={{ __html: post.short_desc }}></p>

      <p dangerouslySetInnerHTML={{ __html: post.long_desc }}></p>

      <hr />
    </Container>
  )
}
