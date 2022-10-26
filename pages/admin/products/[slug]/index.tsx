import { Layout } from '@components/common'
import { Button, Container, Input, Text } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { categoryToSelect, useCategories } from '@lib/api/shop/categories'
import { inputDateFormat } from '@lib/api/page/date'
import { deleteFile } from '@lib/api/page/files'
import useLoading from '@lib/hooks/useLoading'
import {
  getDonorsCount,
  getProduct,
  getProductCmsId,
  Product,
  ProductImage,
  setProduct,
  uploadGallery,
} from '@lib/api/shop/products'
import { Timestamp } from 'firebase/firestore'
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

interface ProductEditProps {
  product: Product | null
  isEditing: boolean
}

const Select = dynamic(import('react-select/creatable'), { ssr: false })
const Editor = dynamic(import('../../../../components/common/Editor'), {
  ssr: false,
})

export default function ProductEdit({ product, isEditing }: ProductEditProps) {
  const [title_1, setTitle1] = useState(product?.title_1 || '')
  const [title_2, setTitle2] = useState(product?.title_2 || '')
  const [price, setPrice] = useState(product?.price || 0)
  const [show_donors, setShowDonors] = useState(product?.show_donors || false)
  const [slug, setSlug] = useState(product?.slug || '')
  const [created_date, setCreatedDate] = useState(
    inputDateFormat(
      product?.created_date ? product.created_date : new Date().getTime() / 1000
    )
  )
  const [closing_date, setClosingDate] = useState(
    product?.closing_date ? inputDateFormat(product.closing_date) : ''
  )
  const [winner_announce_date, setWinnerAnnounceDate] = useState(
    product?.winner_announce_date
      ? inputDateFormat(product.winner_announce_date)
      : ''
  )

  const [short_desc, setShortDesc] = useState(product?.short_desc || '')

  const [category, setCategory] = useState(product?.category || '')
  const [donation_entries, setDonationEntries] = useState(
    product?.donation_entries || ''
  )
  const [gallery, setGallery] = useState<ProductImage[]>(product?.gallery || [])

  const [donors, setDonors] = useState(0)

  const loading = useLoading()
  const uploading = useLoading()
  const loadingDonors = useLoading()

  const categories = useCategories()

  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    if (!product) return

    loadingDonors.start()

    getDonorsCount(product.slug)
      .then(setDonors)
      .catch((e) => {})
      .finally(loadingDonors.stop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

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

  const handleDeleteImage = async (image: ProductImage) => {
    if (!(await confirm('Vymazať obrázok?'))) return

    setGallery((gallery) => gallery.filter((i) => i.path !== image.path))
    deleteFile(image.path).catch(handleErrorFlash)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    if (!slug || !title_1 || !title_2 || !category)
      return flash('Vyplňte všetky polia', 'danger')

    loading.start()

    setProduct({
      title_1,
      title_2,
      show_donors,
      price,
      slug,
      created_date,
      closing_date,
      winner_announce_date,
      gallery,
      short_desc,
      category,
      donation_entries,
      winner_order: product?.winner_order || null,
    })
      .then(() => {
        flash('Produkt uložený', 'success')
        router.push('/products/' + slug)
      })
      .catch(handleErrorFlash)
      .finally(loading.stop)
  }

  return (
    <Permit permission={PERMISSIONS.PRODUCTS_FORM} redirect="/admin/products">
      <AdminLayout>
        <Text className="my-4" variant="heading">
          {t(isEditing ? 'admin.editProduct' : 'admin.addNewProduct')}
        </Text>
        <form onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-6">
            <Input
              variant="ghost"
              type="text"
              value={title_1}
              placeholder={t('title')}
              onChange={setTitle1}
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

            <Input
              variant="ghost"
              type="number"
              value={price}
              placeholder="Price"
              onChange={setPrice}
            >
              Price
            </Input>

            <label>
              <input
                type="checkbox"
                checked={show_donors}
                onChange={(e) => setShowDonors(e.target.checked)}
              />{' '}
              Show donors number ({loadingDonors.pending ? '...' : donors})
            </label>

            <Input
              variant="ghost"
              type="text"
              value={title_2}
              placeholder={t('product.support')}
              onChange={setTitle2}
            >
              {t('product.support')}
            </Input>

            <label className="w-[40%]">
              {t('category')} <br />
              {Select && (
                // @ts-ignore
                <Select
                  className="outline-none border border-primary rounded-md"
                  options={categories.map(categoryToSelect)}
                  onChange={(e: any) => setCategory(e.value)}
                  value={categoryToSelect(
                    categories.find((c) => c.slug === category)
                  )}
                  onCreateOption={(title) =>
                    createCategory({
                      title,
                      slug: _.kebabCase(title),
                    })
                      .then(() => setCategory(_.kebabCase(title)))
                      .catch(handleErrorFlash)
                  }
                />
              )}
            </label>

            <Input
              variant="ghost"
              type="date"
              value={closing_date}
              placeholder={t('product.closing')}
              onChange={setClosingDate}
            >
              {t('product.closing')}
            </Input>

            <Input
              variant="ghost"
              type="date"
              value={winner_announce_date}
              placeholder={t('product.winnerAnnounce')}
              onChange={setWinnerAnnounceDate}
            >
              {t('product.winnerAnnounce')}
            </Input>

            <label>
              {t('product.shortDescription')} <br />
              {Editor && (
                // @ts-ignore
                <Editor value={short_desc} onChange={setShortDesc} />
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
            <Button
              type="button"
              onClick={() => router.push('/admin/products')}
            >
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

  const product = isEditing
    ? await getProduct((params?.slug as string) || '').catch(console.error)
    : null

  if (isEditing && !product) return { notFound: true }

  return { props: { product, isEditing } }
}
