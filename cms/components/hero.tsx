import Hero, { HeroProps } from '@components/ui/Hero/Hero'
import { ComponentConfig } from '../types'

const config: ComponentConfig<HeroProps> = {
  type: 'hero',
  title: 'Hero',
  Component: Hero,
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

export default config
