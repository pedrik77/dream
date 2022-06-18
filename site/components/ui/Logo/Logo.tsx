import Image from 'next/image'

const Logo = ({ className = '', size = 50, ...props }) => (
  <Image height={size} width={size} src="/icon.png" alt="logo" />
)

export default Logo
