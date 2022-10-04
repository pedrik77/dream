import { FC } from 'react'
import cn from 'clsx'
import Link from 'next/link'
import { Logo, Container } from '@components/ui'
import s from './Footer.module.css'
import Newsletter from './Newsletter'
import { Link as LinkType, useMenu } from '@lib/menu'
import { useTranslation } from 'react-i18next'
import { CMS } from 'cms'

interface Props {
  className?: string
  children?: any
}

const Footer: FC<Props> = ({ className }) => {
  const rootClassName = cn(s.root, className)

  const { main, legal } = useMenu()
  const { t } = useTranslation()

  return (
    <footer className={rootClassName}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 border-b border-accent-0 py-12 text-accent-0 transition-colors duration-150">
          <div className="flex flex-col justify-between col-span-1 lg:col-span-6">
            <div className="grid grid-cols-1 md:grid-flow-col max-w-lg gap-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-4 gap-x-4">
                <h3 className="uppercase font-bold md:col-span-2 ">
                  <CMS blockId="footer__menu_title" single={CMS.Text} />
                </h3>

                {main.map(renderLink)}
              </div>
              <div className="grid grid-cols-1 md:grid-rows-4 gap-x-4">
                <h3 className="uppercase font-bold">
                  <CMS blockId="footer__legal_menu_title" single={CMS.Text} />
                </h3>
                {legal.map(renderLink)}
              </div>
            </div>
            <div>
              <Link href="/">
                <a className="flex flex-initial items-center font-bold md:mr-24 my-4">
                  <span className="mr-2">
                    <Logo />
                  </span>
                </a>
              </Link>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-6">
            <div className="py-4 border-b-2">
              <Newsletter />
            </div>

            <div className="py-4">
              <CMS blockId="footer__socials" single={CMS.Socials} />
            </div>
          </div>
        </div>
        <div className="pt-6 pb-10 flex flex-col md:flex-row justify-between items-center space-y-4 text-secondary text-sm">
          <div>
            <span>{t('footer.copyright')}</span>
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

const renderLink = (link: LinkType) => (
  <span key={link.href} className="py-3 md:py-0 md:pb-4">
    <Link href={link.href}>
      <a className="text-accent-0 hover:text-secondary transition ease-in-out duration-150">
        {link.label}
      </a>
    </Link>
  </span>
)

export default Footer
