import s from './LogosSection.module.css'
import Image from 'next/image'
import Text from '../Text'
import { useTranslation } from 'react-i18next'

const LogosSection = () => {
  const { t } = useTranslation()
  return (
    <section className={s.main}>
      <Text variant="myHeading" className={s.h2}>
        {t('homepage.partners')}
      </Text>
      <div className={s.logos}>
        <div className={s.logo}>
          <Image width={180} height={60} src="/logo1.png" alt="logo" />
        </div>
        <div className={s.logo}>
          <Image width={180} height={60} src="/logo2.png" alt="logo" />
        </div>
        <div className={s.logo}>
          <Image width={180} height={60} src="/logo3.png" alt="logo" />
        </div>
        <div className={s.logo}>
          <Image width={180} height={60} src="/logo1.png" alt="logo" />
        </div>
        <div className={s.logo}>
          <Image width={180} height={60} src="/logo2.png" alt="logo" />
        </div>
        <div className={s.logo}>
          <Image width={180} height={60} src="/logo3.png" alt="logo" />
        </div>
      </div>
    </section>
  )
}

export default LogosSection
