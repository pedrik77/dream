import Image from 'next/image'

const Logo = ({ className = '', height = 45, width = 150, ...props }) => (
  <Image
    height={height}
    width={width}
    src="/logo-white-500-%C3%97-150-px).png"
    alt="logo"
  />
)

export default Logo
