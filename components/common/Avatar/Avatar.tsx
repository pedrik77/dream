import { FC, useRef, useEffect } from 'react'
import { useAuthContext } from '@lib/api/page/auth'

interface Props {
  className?: string
}

const Avatar: FC<Props> = () => {
  let { customer } = useAuthContext()

  return (
    <img
      width={200}
      height={200}
      alt="avatar"
      src={customer.avatar}
      className="rounded-full"
    />
  )
}

export default Avatar
