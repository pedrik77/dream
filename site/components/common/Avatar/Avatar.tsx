import { FC, useRef, useEffect } from 'react'
import { useUserAvatar } from '@lib/hooks/useUserAvatar'
import Image from 'next/image'

interface Props {
  className?: string
  children?: any
}

const Avatar: FC<Props> = ({}) => {
  let { userAvatar, isPlaceholder } = useUserAvatar()

  if (isPlaceholder) return <Placeholder backgroundImage={userAvatar} />

  return (
    <Image
      width={200}
      height={200}
      alt="avatar"
      src={'/assets/avatar.jpg'}
      className="rounded-full"
    />
  )
}

const Placeholder: FC<{ backgroundImage: string }> = ({ backgroundImage }) => {
  return (
    <div
      style={{ backgroundImage }}
      className="inline-block h-8 w-8 rounded-full border-2 border-primary hover:border-secondary focus:border-secondary transition-colors ease-linear"
    ></div>
  )
}

export default Avatar
