import { Input } from '@components/ui'
import Hero, { HeroProps } from '@components/ui/Hero/Hero'
import { prompt } from '@lib/alerts'
import { ComponentConfig, Settable } from '../types'

const type = 'hero'

const config: ComponentConfig<HeroProps> = {
  type,
  title: 'Hero',
  Component: Hero,
  Editor: HeroEditor,
  valuesDefinition: {
    headline: ['Nadpis', 'Každý je príťaž'],
    description: [
      'Popis',
      'Súťažte o fantastické výhry a podporte tým zmysluplné projekty. Bla bla lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer viverra odio sit amet lorem vestibulum, a condimentum eros hendrerit. Sed sed cursus arcu. Quisque tincidunt justo sed sem consectetur consequat. In non lorem nulla.',
    ],
    className: false,
    button: false,
  },
}

function HeroEditor({ setData: setHero, ...hero }: Settable<HeroProps>) {
  return (
    <>
      <Input
        value={hero.headline}
        placeholder={'hero.headline'}
        onChange={(headline) => setHero({ ...hero, headline })}
      >
        Headline
      </Input>
      <Input
        value={hero.description}
        placeholder={'hero.description'}
        onChange={(description) => setHero({ ...hero, description })}
      >
        Description
      </Input>
    </>
  )
}

export default config
