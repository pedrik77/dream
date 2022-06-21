import Image from 'next/image'
import { flash } from '../FlashMessage'

const Logo = ({ className = '', height = 54, width = 180, ...props }) => (
  <Image
    height={height}
    width={width}
    src="/logo-white-500-%C3%97-150-px).png"
    alt="logo"
    onClick={() => ['info','success','danger'].map(status => flash('ahoj', status, 360))}
  />
)

export default Logo
