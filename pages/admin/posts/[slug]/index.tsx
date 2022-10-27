import { Layout } from '@components/common'
import { Button, Container, Input, Text } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { inputDateFormat } from '@lib/api/page/date'
import useLoading from '@lib/hooks/useLoading'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { ChangeEventHandler, FormEventHandler, useState } from 'react'
import _ from 'lodash'
import { confirm } from '@lib/api/page/alerts'
import Permit from '@components/common/Permit'
import { PERMISSIONS } from '@lib/api/page/auth'
import AdminLayout from '@components/common/AdminLayout'
import { useTranslation } from 'react-i18next'
import { blog, page } from '@lib/api'
import { Post } from '@lib/api/blog/posts'
import { Tag } from '@lib/api/blog/tags'
import { FileType } from '@lib/api/creator'

interface PostEditProps {
  post: Post | null
  isEditing: boolean
}

const Select = dynamic(import('react-select/creatable'), { ssr: false })
const Editor = dynamic(import('../../../../components/common/Editor'), {
  ssr: false,
})

export default function PostEdit({ post, isEditing }: PostEditProps) {
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [created_date, ___] = useState(
    post?.created_date ? post.created_date : new Date()
  )
  const [published_date, setPublishedDate] = useState(
    post?.published_date ? post.published_date : new Date()
  )
  const [short_desc, setShortDesc] = useState(post?.short_desc || '')
  const [long_desc, setLongDesc] = useState(post?.long_desc || '')

  const [tag, setTag] = useState(post?.tags?.[0] || '')

  const [gallery, setGallery] = useState<FileType[]>(post?.gallery || [])

  const loading = useLoading()
  const uploading = useLoading()

  const tags = blog.tags.useTags()

  const router = useRouter()
  const { t } = useTranslation()

  const handleUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files

    if (!files || !files.length) return

    uploading.start()

    blog.posts
      .uploadFiles(files)
      .then((uploaded) => {
        setGallery((gallery) => [...gallery, ...uploaded])
        e.target.value = ''
      })
      .catch(handleErrorFlash)
      .finally(uploading.stop)
  }

  const handleDeleteImage = async (image: FileType) => {
    if (!(await confirm('Vymazať obrázok?'))) return

    setGallery((gallery) => gallery.filter((i) => i.path !== image.path))
    page.files.del(image.path).catch(handleErrorFlash)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    if (!slug || !title) return flash('Vyplňte všetky polia', 'danger')

    loading.start()

    blog.posts
      .set({
        title,
        slug,
        created_date,
        published_date,
        short_desc,
        long_desc,
        tags: [tag],
        gallery,
        image: null,
      })
      .then(() => {
        flash('Post uložený', 'success')
        router.push('/' + slug)
      })
      .catch(handleErrorFlash)
      .finally(loading.stop)
  }

  return (
    <Permit permission={PERMISSIONS.POSTS_FORM} redirect="/admin/posts">
      <AdminLayout>
        <Text className="my-4" variant="heading">
          {t(isEditing ? 'admin.editPost' : 'admin.addNewPost')}
        </Text>
        <form onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-6">
            <Input
              variant="ghost"
              type="text"
              value={title}
              placeholder={t('title')}
              onChange={setTitle}
            >
              {t('title')}
            </Input>

            <Input
              variant="ghost"
              type="date"
              value={inputDateFormat(published_date)}
              placeholder={t('post.published_date')}
              onChange={setPublishedDate}
            >
              {t('post.published_date')}
            </Input>
            <Input
              variant="ghost"
              type="text"
              value={slug}
              placeholder="Slug"
              onChange={setSlug}
              disabled={isEditing}
            >
              Slug
            </Input>

            <label className="w-[40%]">
              {t('tag')} <br />
              {Select && (
                // @ts-ignore
                <Select
                  className="outline-none border border-primary rounded-md"
                  options={tags.map(blog.tags.tagToSelect)}
                  onChange={(e: any) => setTag(e.value)}
                  value={blog.tags.tagToSelect(
                    tags.find((t: Tag) => t.slug === tag)
                  )}
                  onCreateOption={(name) =>
                    blog.tags
                      .setTag({
                        name,
                        slug: _.kebabCase(name),
                      })
                      .then(() => setTag(_.kebabCase(name)))
                      .catch(handleErrorFlash)
                  }
                />
              )}
            </label>

            <label>
              {t('post.shortDescription')} <br />
              {Editor && (
                // @ts-ignore
                <Editor value={short_desc} onChange={setShortDesc} />
              )}
            </label>

            <label>
              {t('post.longDescriptions')} <br />
              {Editor && (
                // @ts-ignore
                <Editor value={long_desc} onChange={setLongDesc} />
              )}
            </label>

            {/* TODO: add trash icon on hover */}

            <label>
              {t('cms.labels.gallery')}
              {t('cms.labels.postImage')}
              <br />
              <input
                type="file"
                onChange={handleUpload}
                multiple
                disabled={uploading.pending}
              />
            </label>
            {uploading.pending && 'Uploading...'}
            <div className="flex flex-wrap overflow-y-auto">
              {gallery.map((image) => (
                <figure
                  key={image.filename}
                  className="basis-[32%] cursor-pointer"
                  onClick={() => handleDeleteImage(image)}
                >
                  <img src={image.src} alt={image.filename} />
                </figure>
              ))}
            </div>
          </fieldset>
          {!isEditing && <div>{t('admin.continueToContent')}</div>}
          <div className="flex gap-4 my-12 justify-center">
            <Button disabled={loading.pending}>Uložiť</Button>
            <Button type="button" onClick={() => router.push('/admin/posts')}>
              {t('back')}
            </Button>
          </div>
        </form>
      </AdminLayout>
    </Permit>
  )
}

PostEdit.Layout = Layout

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const isEditing = params && params?.slug != 'add'

  const post = isEditing
    ? await blog.posts.get
        .one((params?.slug as string) || '')
        .catch(console.error)
    : null

  if (isEditing && !post) return { notFound: true }

  return { props: { post, isEditing } }
}
