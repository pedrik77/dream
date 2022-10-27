import { Container, Text } from '@components/ui'
import { page } from '@lib/api'
import { Post } from '@lib/api/blog/posts'
import Link from 'next/link'
import React from 'react'

interface ListProps {
  posts: Post[]
}

export default function List({ posts }: ListProps) {
  return (
    <Container>
      {posts.map((post) => (
        <Link key={post.slug} href={`/${post.slug}`}>
          <a>
            <Text variant="sectionHeading">{post.title}</Text>

            <p>{page.date.basicShowFormat(post.published_date)}</p>

            <p dangerouslySetInnerHTML={{ __html: post.short_desc }}></p>
            <hr />
          </a>
        </Link>
      ))}
    </Container>
  )
}
