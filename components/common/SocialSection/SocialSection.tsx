import s from './SocialSection.module.css'

export const SOCIAL_OPTIONS = ['instagram', 'youtube', 'facebook', 'twitter']

export interface SocialSectionProps {
  title: string
  links: string[]
}

const SocialSection = ({ title, links }: SocialSectionProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-bold">{title}</h3>
      <div className="flex gap-3 lg:justify-end">
        {links.map((link) => (
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
              <img
                src={`/${SOCIAL_OPTIONS.find((social) =>
                  link.includes(social)
                )}.svg`}
                alt="icon"
                className={s.icon}
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
export default SocialSection
