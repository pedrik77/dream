import Image from 'next/image'

const SIZE = 50

const Logo = ({ className = '', ...props }) => (
  <Image height={SIZE} width={SIZE} src="/icon.png" alt="logo" />
)

export default Logo
