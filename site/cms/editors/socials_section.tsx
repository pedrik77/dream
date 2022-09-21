import { SocialSectionProps } from '@components/common/SocialSection/SocialSection'
import { Button } from '@components/ui'
import { InputEditor } from 'cms/types'
import { Input } from './input'

export const SocialsEditor: InputEditor<string[], SocialSectionProps> = ({
  value: links,
  onChange,
}) => {
  return (
    <>
      <div>
        <Button variant="cms" onClick={() => onChange(['', ...links])}>
          +
        </Button>
        <Button variant="cms" onClick={() => onChange(links.slice(1))}>
          -
        </Button>
      </div>

      {links.map((link, i) => (
        <Input
          key={i}
          value={link}
          onChange={(link: string) => {
            const newLinks = [...links]
            newLinks[i] = link
            onChange(newLinks)
          }}
        />
      ))}
    </>
  )
}
