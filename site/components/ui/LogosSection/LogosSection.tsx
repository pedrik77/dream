import s from './LogosSection.module.css'
import Image from 'next/image'
import Text from '../Text'

const LogosSection = () => {
  return (
    <section className={s.main}>
      <Text variant="myHeading" className={s.h2}>
        Naši partneri
      </Text>
      <Text className={s.text}>
        Check our partners bisquit. Sweet carrot cake macaroon bonbon croissant
        fruitcake jujubes macaroon oat cake.
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
