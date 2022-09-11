import s from './LogosSection.module.css'
import Image from 'next/image'
import Text from '../Text'
import { useTranslation } from 'react-i18next'

export interface LogosSectionProps {
  heading?: string
  imgs: string[]
  width?: number
  height?: number
}

const LogosSection = ({
  heading,
  imgs,
  width = 180,
  height = 60,
}: LogosSectionProps) => {
  const { t } = useTranslation()
  return (
    <section className={s.main}>
      {!!heading && (
        <Text variant="myHeading" className={s.h2}>
          {heading}
        </Text>
      )}
      <div className={s.logos}>
        {imgs.map((image, i) => (
          <div key={i} className={s.logo}>
            <Image width={width} height={height} src={image} alt="logo" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default LogosSection
