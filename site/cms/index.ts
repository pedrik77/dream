import { getComponentStarter } from './getters'

export { Components as CMS } from './ui'

export async function getStarter(type: string) {
  const component = await getComponentStarter(type)

  return { components: [component] }
}
