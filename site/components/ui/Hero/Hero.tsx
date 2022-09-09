import React, { FC } from 'react'
import { Container } from '@components/ui'
import { ArrowRight } from '@components/icons'
import s from './Hero.module.css'
import Link from 'next/link'
import Text from '../Text'

export interface HeroProps {
  className?: string
  headline: string
  description: string
  button?: { text: string; href: string }
}

const Hero: FC<HeroProps> = ({ headline, description, button }) => {
  return (
    <div className="bg-primary">
      <Container>
        <div className={s.root}>
          <Text variant="myHeading" className={s.h2}>
            {headline}
          </Text>
          <div className={s.description}>
            <p>{description}</p>
            {!!button && (
              <Link href={button.href}>
                <a className="flex items-center text-secondary pt-3 font-bold hover:underline cursor-pointer w-max-content">
                  {button.text}
                  <ArrowRight width="20" height="20" className="ml-1" />
                </a>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Hero
