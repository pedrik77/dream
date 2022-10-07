import Image from 'next/image'
import { useState } from 'react'

const Logo = ({ className = '', ...props }) => {
  const [src, setSrc] = useState(
    props.src || '/logo-white-500-%C3%97-150-px).png'
  )
  const [width, setWidth] = useState(props.width || 180)
  const [height, setHeight] = useState(props.height || 54)

  return (
    <>
      <Image height={height} width={width} src={src} alt="logo" />
    </>
  )
}

export default Logo
