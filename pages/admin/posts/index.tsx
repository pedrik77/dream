import { Layout } from '@components/common'
import { Button, Container, Text } from '@components/ui'
import { PERMISSIONS } from '@lib/api/page/auth'
import Permit from '@components/common/Permit'
import { useState } from 'react'
import {
  deleteProduct,
  Product,
  setProduct,
  useProducts,
} from '@lib/api/shop/products'
import { basicShowFormat } from '@lib/api/page/date'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { useRouter } from 'next/router'
import { confirm, prompt } from '@lib/api/page/alerts'
import { Col, DataGrid } from '@components/common/DataGrid'
import { useTranslation } from 'react-i18next'
import AdminLayout from '@components/common/AdminLayout'
import { deletePost, usePosts } from '@lib/api/blog/posts'

export default function Posts() {
  const router = useRouter()

  const { posts } = usePosts({
    onError: handleErrorFlash,
  })

  const { t } = useTranslation()

  const [selected, setSelected] = useState<string[]>([])

  const handleDeleteSelected = async () => {
    if (!(await confirm(t('sure')))) return

    deletePost(selected)
      .then(() => flash(t('deleted') + ': ' + selected.length))
      .catch(handleErrorFlash)
  }

  const redirectToAddPost = () => router.push('/admin/posts/add')

  return (
    <Permit permission={PERMISSIONS.POSTS_LIST} redirect="/admin">
      <AdminLayout>
        <div>
          <Permit permission={PERMISSIONS.POSTS_FORM}>
            <Text variant="heading">{t('admin.editPosts')}</Text>

            <Button
              onClick={redirectToAddPost}
              className="my-4 mr-2"
              variant="ghost"
              type="button"
            >
              {t('admin.addNewPost')}
            </Button>
          </Permit>
          <Permit permission={PERMISSIONS.POSTS_DELETE}>
            <Button
              onClick={handleDeleteSelected}
              className="my-4 mr-2"
              disabled={!selected.length}
              type="button"
            >
              {t('delete')} ({selected.length})
            </Button>
          </Permit>
        </div>
        <DataGrid
          rows={posts}
          checkboxSelection
          onRowClick={(r) => router.push(`/admin/posts/${r.id}`)}
          onSelectionModelChange={(selected) =>
            setSelected(selected as string[])
          }
          rowIdKey="slug"
        >
          <Col field="slug" headerName="Slug" width={170} />
          <Col field="title" headerName={t('title')} width={350} />
          <Col field="created_date" headerName={t('post.created')} width={130}>
            {(r) => basicShowFormat(r.value)}
          </Col>
        </DataGrid>
      </AdminLayout>
    </Permit>
  )
}

Posts.Layout = Layout
