import { Layout } from '@components/common'
import { Button, Container, Input } from '@components/ui'
import { flash } from '@components/ui/FlashMessage'
import { useCategories } from '@lib/categories'
import { inputDateFormat } from '@lib/date'
import { getProduct, Product, setProduct } from '@lib/products'
import { Timestamp } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { FormEventHandler, useState } from 'react'

interface ProductEditProps {
  product: Product | null
  isEditing: boolean
}

const Select = dynamic(import('react-select'), { ssr: false })
const Editor = dynamic(import('../../../components/common/Editor'), {
  ssr: false,
})

export default function ProductEdit({ product, isEditing }: ProductEditProps) {
  const [title_1, setTitle1] = useState(product?.title_1 || '')
  const [title_2, setTitle2] = useState(product?.title_2 || '')
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

  const [isSaving, setSaving] = useState(false)

  const { categories } = useCategories()

  const router = useRouter()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    if (!slug || !title_1 || !title_2 || !category)
      return flash('Vyplňte všetky polia', 'danger')

    setSaving(true)

    setProduct({
      title_1,
      title_2,
      slug,
      closing_date: Timestamp.fromDate(new Date(closing_date)),
      winner_announce_date: Timestamp.fromDate(new Date(winner_announce_date)),
      short_desc,
      long_desc,
      category,
      donation_entries,
    })
      .then(() => {
        flash('Produkt uložený', 'success')
        router.push('/admin/products')
      })
      .catch((e) => {
        flash(e.message, 'danger')
      })
      .finally(() => setSaving(false))
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
            Title 2
            <Input
              type="text"
              value={title_2}
              placeholder="Title 2"
              onChange={setTitle2}
            />
          </label>
          <label>
            Category <br />
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="">Nezaradené</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
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
            <textarea
              value={long_desc}
              onChange={(e) => setLongDesc(e.target.value)}
            />
          </label>
        </fieldset>

        <Button disabled={isSaving}>Uložiť</Button>
      </form>
    </Container>
  )
}

ProductEdit.Layout = Layout

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const isEditing = params && params.slug != 'add'

  const product = isEditing ? await getProduct(params.slug as string) : null

  if (isEditing && !product) return { notFound: true }

  return { props: { product, isEditing } }
}
