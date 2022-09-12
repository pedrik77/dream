import { Button } from '@components/ui'
import { LogosSectionProps } from '@components/ui/LogosSection/LogosSection'
import { InputEditor } from 'cms/types'
import { getImageInput } from './input'
import { v4 as uuid4 } from 'uuid'

export const LogosEditor: InputEditor<string[], LogosSectionProps> = ({
  value: logos,
  onChange,
  width = 0,
  height = 0,
}) => {
  const ImageInput = getImageInput({
    imagePreview: { width, height },
    getPath: () => 'cms/logos_section/' + uuid4(),
  })

  return (
    <>
      <div>
        <Button variant="cms" onClick={() => onChange(['', ...logos])}>
          +
        </Button>
        <Button variant="cms" onClick={() => onChange(logos.slice(1))}>
          -
        </Button>
      </div>

      {logos.map((logo, i) => (
        <ImageInput
          key={i}
          value={logo}
          onChange={(logo: string) => {
            const newLogos = [...logos]
            newLogos[i] = logo
            onChange(newLogos)
          }}
        />
      ))}
    </>
  )
}
