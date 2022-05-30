// @ts-ignore
import { flash as reactFlash } from 'react-universal-flash'
import cn from 'clsx'

export type FlashType = 'success' | 'danger' | 'warning' | 'info'

type MessageType = string | JSX.Element
type MessageCallbackType = (deleteFlash: DeleteFlashType) => MessageType
type DeleteFlashType = () => void

interface Props {
  type: FlashType
  content: MessageCallbackType | MessageType
  deleteFlash: DeleteFlashType
}

export const FlashMessage: React.FC<Props> = ({
  type,
  content,
  deleteFlash,
}) => {
  const flashBody =
    typeof content === 'function' ? content(deleteFlash) : content

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
      {flashBody}
      <span className="font-bold px-2 cursor-pointer" onClick={deleteFlash}>
        &times;
      </span>
    </div>
  )
}

export const flash = (
  message: MessageCallbackType | MessageType,
  type: FlashType = 'info',
  seconds = 4
) => reactFlash(message, seconds * 1000, type)
