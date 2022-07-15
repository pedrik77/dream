import { Layout } from '@components/common'
import { Button, Container, Input } from '@components/ui'
import { flash, handleErrorFlash } from '@components/ui/FlashMessage'
import { Category, useCategories } from '@lib/categories'
import { inputDateFormat } from '@lib/date'
import { deleteFile } from '@lib/files'
import useLoading from '@lib/hooks/useLoading'
import {
  getProduct,
  Product,
  ProductImage,
  setProduct,
  uploadGallery,
} from '@lib/products'
import { Timestamp } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { ChangeEventHandler, FormEventHandler, useState } from 'react'
import { setCategory as createCategory } from '@lib/categories'
import _ from 'lodash'
import { confirm } from '@lib/alerts'

interface ProductEditProps {
  product: Product | null
  isEditing: boolean
}

const Select = dynamic(import('react-select/creatable'), { ssr: false })
const Editor = dynamic(import('../../../components/common/Editor'), {
  ssr: false,
})

export default function ProductEdit({ product, isEditing }: ProductEditProps) {
  const [title_1, setTitle1] = useState(product?.title_1 || '')
  const [title_2, setTitle2] = useState(product?.title_2 || '')
  const [price, setPrice] = useState(product?.price || 0)
  const [show_donors, setShowDonors] = useState(product?.show_donors || false)
  const [slug, setSlug] = useState(product?.slug || '')
  const [closing_date, setClosingDate] = useState(
    product?.closing_date ? inputDateFormat(product.closing_date) : ''
  )
  const [winner_announce_date, setWinnerAnnounceDate] = useState(
    product?.winner_announce_date
      ? inputDateFormat(product.winner_announce_date)
      : ''
  )
  const [short_desc, setShortDesc] = useState(product?.short_desc || '')
  const [long_desc, setLongDesc] = useState(product?.long_desc || '')
  const [category, setCategory] = useState(product?.category || '')
  const [donation_entries, setDonationEntries] = useState(
    product?.donation_entries || ''
  )
  const [gallery, setGallery] = useState<ProductImage[]>(product?.gallery || [])

  const loading = useLoading()
  const uploading = useLoading()

  const { categories } = useCategories()

  const router = useRouter()

  const categoryToSelect = (c?: Category) => ({
    value: c?.slug || '',
    label: c?.title || '',
  })

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
      closing_date: Timestamp.fromDate(new Date(closing_date)),
      winner_announce_date: Timestamp.fromDate(new Date(winner_announce_date)),
      gallery,
      short_desc,
      long_desc,
      category,
      donation_entries,
    })
      .then(() => {
        flash('Produkt uložený', 'success')
        router.push('/admin/products')
      })
      .catch(handleErrorFlash)
      .finally(loading.stop)
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <fieldset className="flex">
          <label>
            Title 1
            <Input
              type="text"
              value={title_1}
              placeholder="Title 1"
              onChange={setTitle1}
            />
          </label>
          <label>
            Slug
            <Input
              type="text"
              value={slug}
              placeholder="Slug"
              onChange={setSlug}
              disabled={isEditing}
            />
          </label>
        </fieldset>
        <fieldset className="flex">
          <label>
            Price
            <Input
              type="number"
              value={price}
              placeholder="Price"
              onChange={setPrice}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={show_donors}
              onChange={(e) => setShowDonors(e.target.checked)}
            />{' '}
            Show donors number
          </label>
        </fieldset>
        <fieldset className="flex">
          <label>
            Title 2
            <Input
              type="text"
              value={title_2}
              placeholder="Title 2"
              onChange={setTitle2}
            />
          </label>
          <label className="w-full">
            Category <br />
            {Select && (
              // @ts-ignore
              <Select
                options={categories.map(categoryToSelect)}
                onChange={(e: any) => setCategory(e.value)}
                value={categoryToSelect(
                  categories.find((c) => c.slug === category)
                )}
                onCreateOption={(title) =>
                  createCategory({
                    title,
                    slug: _.kebabCase(title),
                    menu_position: -1,
                  })
                    .then(() => setCategory(_.kebabCase(title)))
                    .catch(handleErrorFlash)
                }
              />
            )}
          </label>
        </fieldset>
        <fieldset className="flex">
          <label>
            Closing date
            <Input
              type="date"
              value={closing_date}
              placeholder="Closing date"
              onChange={setClosingDate}
            />
          </label>
          <label>
            Winner announce date
            <Input
              type="date"
              value={winner_announce_date}
              placeholder="Winner announce date"
              onChange={setWinnerAnnounceDate}
            />
          </label>
        </fieldset>
        <fieldset>
          <label>
            Short description <br />
            <textarea
              value={short_desc}
              onChange={(e) => setShortDesc(e.target.value)}
            />
          </label>
        </fieldset>
        <fieldset>
          <label>
            Long description <br />
            {Editor && (
              // @ts-ignore
              <Editor value={long_desc} onChange={setLongDesc} />
            )}
          </label>
        </fieldset>
        <fieldset>
          <label>
            Gallery (click on image to delete)
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

        <Button disabled={loading.pending}>Uložiť</Button>
      </form>
    </Container>
  )
}

ProductEdit.Layout = Layout

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const isEditing = params && params?.slug != 'add'

  const product = isEditing
    ? await getProduct((params?.slug as string) || '')
    : null

  if (isEditing && !product) return { notFound: true }

  return { props: { product, isEditing } }
}
