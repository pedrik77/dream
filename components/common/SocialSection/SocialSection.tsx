import s from './SocialSection.module.css'

export const SOCIAL_OPTIONS = [
  'instagram',
  'youtube',
  'facebook',
  'twitter',
  'tiktok',
  'snapchat',
]

export interface SocialSectionProps {
  title: string
  links: string[]
}

const SocialSection = ({ title, links }: SocialSectionProps) => {
  return (
    <div className="flex flex-col gap-3 lg:text-right">
      <h3 className="font-bold">Kontakt</h3>
      <div className="flex flex-col gap-3 lg:justify-end">
        <div>
          <a href="mailto:info@vysnivaj.si">info@vysnivaj.si</a>
        </div>
        <div>
          <a href="tel:+421918374936">+421 918 374 936</a>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-3 lg:text-right">
      <h3 className="font-bold">{title}</h3>
      <div className="flex gap-3 lg:justify-end">
        {links.map((link) => {
          const social = SOCIAL_OPTIONS.find((social) => link.includes(social))

          return (
            <a
              key={link}
              className={s.link}
              target="_blank"
              rel="noreferrer"
              href={link}
            >
              <div>
                {/*
               eslint-disable-next-line @next/next/no-img-element
             */}
                <img src={`/${social}.png`} alt={social} className={s.icon} />
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
export default SocialSection
