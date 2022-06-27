// @ts-ignore
import _ from 'lodash'
import { flash as reactFlash } from 'react-universal-flash'
import s from './FlashMessage.module.css'
import cn from 'clsx'
import { Cross } from '@components/icons'

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
      className={cn({
        [s.flashMessage]: true,
        [s.flashTypeInfo]: type === 'info',
        [s.flashTypeSuccess]: type === 'success',
        [s.flashTypeWarning]: type === 'warning',
        [s.flashTypeDanger]: type === 'danger',
      })}
    >
      {flashBody}
      <span className={s.close} onClick={deleteFlash}>
        <Cross />
      </span>
    </div>
  )
}

export const flash = (
  message: MessageCallbackType | MessageType,
  type: FlashType = 'info',
  seconds = 4
) => reactFlash(message, seconds * 1000, type)

export const handleErrorFlash = (e: any) => flash(e.message, 'danger')
