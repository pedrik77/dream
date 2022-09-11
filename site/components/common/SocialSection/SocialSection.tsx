import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import s from './SocialSection.module.css'

const SOCIALS = ['instagram', 'youtube', 'facebook', 'twitter']

const SocialSection = () => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-bold">{t('footer.socials')}</h3>
      <div className="flex gap-3 lg:justify-end">
        {SOCIALS.map((social) => (
          <a
            key={social}
            className={s.link}
            target="_blank"
            rel="noreferrer"
            href={`https://${social}.com`}
          >
            <div>
              {/*
               eslint-disable-next-line @next/next/no-img-element
             */}
              <img src={`/${social}.svg`} alt="icon" className={s.icon} />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
export default SocialSection
