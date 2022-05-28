// @ts-ignore
import { flash as reactFlash } from 'react-universal-flash'
import cn from 'clsx'

export type FlashType = 'success' | 'danger' | 'warning' | 'info'

interface Props {
  type: FlashType
  content: any
  deleteFlash: () => void
}

export const FlashMessage: React.FC<Props> = ({
  type,
  content,
  deleteFlash,
}) => {
  return (
    <div
      className={cn(
        'text-white',
        type === 'success' && 'bg-green-500',
        type === 'info' && 'bg-blue-500',
        type === 'danger' && 'bg-red-500',
        type === 'warning' && 'bg-yellow-500'
      )}
    >
      {content}
      <span className="font-bold px-2 cursor-pointer" onClick={deleteFlash}>
        &times;
      </span>
    </div>
  )
}

export const flash = (message: string, type: FlashType = 'info', seconds = 4) =>
  reactFlash(message, seconds * 1000, type)
