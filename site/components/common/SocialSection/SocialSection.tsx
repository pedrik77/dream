import Link from 'next/link'
import s from './SocialSection.module.css'

const SOCIALS = ['instagram', 'youtube', 'facebook', 'twitter']

const SocialSection = () => {
  return (
    <div className="flex flex-col gap-3">
      <h3>FOLLOW US ON</h3>
      <div className="flex gap-3">
        {SOCIALS.map((social) => (
          <Link key={social} href={`https://${social}.com`}>
            <a className={s.link}>
              <div>
                {/*
               eslint-disable-next-line @next/next/no-img-element
             */}
                <img src={`/${social}.svg`} alt="icon" className={s.icon} />
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}
export default SocialSection
