import { Input } from '@components/ui'
import Hero, { HeroProps } from '@components/ui/Hero/Hero'
import { ComponentConfig, Settable } from '../types'

const type = 'hero'

const config: ComponentConfig<HeroProps> = {
  type,
  name: 'Hero',
  Component: Hero,
  Editor: HeroEditor,
  getStarter: () => ({
    type,
    draft: true,
    value: {
      headline: 'Každý je príťaž',
      description:
        'Súťažte o fantastické výhry a podporte tým zmysluplné projekty. Bla bla lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer viverra odio sit amet lorem vestibulum, a condimentum eros hendrerit. Sed sed cursus arcu. Quisque tincidunt justo sed sem consectetur consequat. In non lorem nulla.',
    },
  }),
}

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

export default config
