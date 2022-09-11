import { Button } from '@components/ui'
import { LogosSectionProps } from '@components/ui/LogosSection/LogosSection'
import { uploadFile } from '@lib/files'
import { InputEditor } from 'cms/types'
import { Input } from './input'
import { v4 as uuid4 } from 'uuid'

export const LogosEditor: InputEditor<string[], LogosSectionProps> = ({
  value: logos,
  onChange,
  component,
}) => {
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

      {logos.map((logo, i) => {
        const change = (logo: string) => {
          const newLogos = [...logos]
          newLogos[i] = logo
          onChange(newLogos)
        }
        return (
          <Input
            key={i}
            value={logo}
            type={'file'}
            onChange={change}
            onFile={(file) =>
              uploadFile('cms/logos_section/' + uuid4(), file).then((src) =>
                change(src)
              )
            }
            imagePreview={{
              width: component?.width || 0,
              height: component?.height || 0,
            }}
          />
        )
      })}
    </>
  )
}
