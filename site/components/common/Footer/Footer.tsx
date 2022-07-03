import { FC } from 'react'
import cn from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { Page } from '@commerce/types/page'
import getSlug from '@lib/get-slug'
import { Github, Vercel } from '@components/icons'
import { Logo, Container } from '@components/ui'
import { I18nWidget } from '@components/common'
import s from './Footer.module.css'
import SocialSection from '../SocialSection'
import Newsletter from './Newsletter'
import { useCategories } from '@lib/categories'

interface Props {
  className?: string
  children?: any
  pages?: Page[]
}

const links = [
  {
    name: 'Dom',
    url: '/',
  },
  {
    name: 'Vsetko',
    url: '/products',
  },
]

const Footer: FC<Props> = ({ className, pages }) => {
  const { sitePages } = usePages(pages)
  const rootClassName = cn(s.root, className)

  const categories = useCategories().menu.map((c) => ({
    name: c.title,
    url: `/products?category=${c.slug}`,
  }))

  return (
    <footer className={rootClassName}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-accent-0 py-12 text-accent-0 transition-colors duration-150">
          <div className="col-span-1 lg:col-span-4">
            <div className="py-4 border-b-2">
              <Newsletter />
            </div>

            <div className="py-4 border-b-2">
              <SocialSection />
            </div>
            <Link href="/">
              <a className="flex flex-initial items-center font-bold md:mr-24 my-4">
                <span className="mr-2">
                  <Logo />
                </span>
              </a>
            </Link>
          </div>
          <div className="col-span-1 lg:col-span-6">
            <div className="grid md:grid-rows-4 md:grid-cols-3 md:grid-flow-col">
              {[...links, ...categories, ...sitePages].map((page) => (
                <span key={page.url} className="py-3 md:py-0 md:pb-4">
                  <Link href={page.url!}>
                    <a className="text-accent-0 hover:text-secondary transition ease-in-out duration-150">
                      {page.name}
                    </a>
                  </Link>
                </span>
              ))}
            </div>
          </div>
          <div className="col-span-1 lg:col-span-2 flex items-start lg:justify-end text-accent-0">
            <div className="flex space-x-6 items-center h-10">
              <a
                className={s.link}
                aria-label="Github Repository"
                href="https://github.com/vercel/commerce"
              >
                <Github />
              </a>
              <I18nWidget />
            </div>
          </div>
        </div>
        <div className="pt-6 pb-10 flex flex-col md:flex-row justify-between items-center space-y-4 text-secondary text-sm">
          <div>
            <span>&copy; 2022 vysnivaj.si. All rights reserved.</span>
          </div>
          <div className="flex items-center text-primary text-sm">
            <span className="text-secondary">Created by</span>
            <a
              rel="noopener noreferrer"
              href="https://jana.wtf"
              aria-label="Mlocco link"
              target="_blank"
              className="text-secondary"
            >
              <h3 className="pl-2">MLOCCOCO AGENCY</h3>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

function usePages(pages?: Page[]) {
  const { locale } = useRouter()
  const sitePages: Page[] = []

  if (pages) {
    pages.forEach((page) => {
      const slug = page.url && getSlug(page.url)
      if (!slug) return
      if (locale && !slug.startsWith(`${locale}/`)) return
      sitePages.push(page)
    })
  }

  return {
    sitePages: sitePages.sort(bySortOrder),
  }
}

// Sort pages by the sort order assigned in the BC dashboard
function bySortOrder(a: Page, b: Page) {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0)
}

export default Footer
