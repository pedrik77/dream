import { Layout } from '@components/common'
import { Button, Container, Input, Text } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { categoryToSelect, useCategories } from '@lib/api/shop/categories'
import { inputDateFormat } from '@lib/api/page/date'
import { deleteFile } from '@lib/api/page/files'
import useLoading from '@lib/hooks/useLoading'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from 'react'
import { setCategory as createCategory } from '@lib/api/shop/categories'
import _ from 'lodash'
import { confirm } from '@lib/api/page/alerts'
import Permit from '@components/common/Permit'
import { PERMISSIONS } from '@lib/api/page/auth'
import AdminLayout from '@components/common/AdminLayout'
import { useTranslation } from 'react-i18next'
import {
  getPost,
  Post,
  PostImage,
  setPost,
  uploadGallery,
} from '@lib/api/blog/posts'

interface PostEditProps {
  post: Post | null
  isEditing: boolean
}

const Select = dynamic(import('react-select/creatable'), { ssr: false })
const Editor = dynamic(import('../../../../components/common/Editor'), {
  ssr: false,
})

export default function ProductEdit({ post, isEditing }: PostEditProps) {
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [created_date, setCreatedDate] = useState(
    inputDateFormat(
      post?.created_date ? post.created_date : new Date().getTime() / 1000
    )
  )
  const [short_desc, setShortDesc] = useState(post?.short_desc || '')
  const [long_desc, setLongDesc] = useState(post?.long_desc || '')

  const [tags, setTags] = useState(post?.tags || '')

  const [gallery, setGallery] = useState<PostImage[]>(post?.gallery || [])

  const loading = useLoading()
  const uploading = useLoading()

  const categories = useCategories()

  const router = useRouter()
  const { t } = useTranslation()

  const handleUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files

    if (!files || !files.length) return

    uploading.start()

    uploadGallery(files)
      .then((uploaded) => {
        setGallery((gallery) => [...gallery, ...uploaded])
        e.target.value = ''
      })
      .catch(handleErrorFlash)
      .finally(uploading.stop)
  }

  const handleDeleteImage = async (image: PostImage) => {
    if (!(await confirm('Vymazať obrázok?'))) return

    setGallery((gallery) => gallery.filter((i) => i.path !== image.path))
    deleteFile(image.path).catch(handleErrorFlash)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    if (!slug || !title) return flash('Vyplňte všetky polia', 'danger')

    loading.start()

    setPost({
      title,
      slug,
      created_date,
      short_desc,
      tags,
      gallery,
    })
      .then(() => {
        flash('Post uložený', 'success')
        router.push('/posts/' + slug)
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
              type="text"
              value={slug}
              placeholder="Slug"
              onChange={setSlug}
              disabled={isEditing}
            >
              Slug
            </Input>

            <label className="w-[40%]">
              {t('category')} <br />
              {Select && (
                // @ts-ignore
                <Select
                  className="outline-none border border-primary rounded-md"
                  options={categories.map(categoryToSelect)}
                  onChange={(e: any) => setTags(e.value)}
                  value={categoryToSelect(
                    categories.find((c) => c.slug === tags)
                  )}
                  onCreateOption={(title) =>
                    createCategory({
                      title,
                      slug: _.kebabCase(title),
                    })
                      .then(() => setTags(_.kebabCase(title)))
                      .catch(handleErrorFlash)
                  }
                />
              )}
            </label>

            <label>
              {t('product.shortDescription')} <br />
              {Editor && (
                // @ts-ignore
                <Editor value={short_desc} onChange={setShortDesc} />
              )}
            </label>

            <label>
              {t('product.longDescriptions')} <br />
              {Editor && (
                // @ts-ignore
                <Editor value={long_desc} onChange={setLongDesc} />
              )}
            </label>

            {/* TODO: add trash icon on hover */}

            <label>
              {t('cms.labels.gallery')}
              {t('cms.labels.productImage')}
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

ProductEdit.Layout = Layout

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const isEditing = params && params?.slug != 'add'

  const post = isEditing
    ? await getPost((params?.slug as string) || '').catch(console.error)
    : null

  if (isEditing && !post) return { notFound: true }

  return { props: { post, isEditing } }
}
