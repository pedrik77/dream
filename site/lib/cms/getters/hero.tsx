import { Input } from '@components/ui'
import { HeroProps } from '@components/ui/Hero/Hero'
import { Settable } from '../types'

export function HeroEditor({
  setData: setHero,
  ...hero
}: HeroProps & Settable) {
  return (
    <>
      <Input
        value={hero.headline}
        placeholder={'hero.headline'}
        onChange={(headline) => setHero({ ...hero, headline })}
      >
        <span className="text-white">Headline</span>
      </Input>
      <Input
        value={hero.description}
        placeholder={'hero.description'}
        onChange={(description) => setHero({ ...hero, description })}
      >
        <span className="text-white">Description</span>
      </Input>
    </>
  )
}
