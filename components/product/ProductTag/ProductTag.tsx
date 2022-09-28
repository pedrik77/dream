import { Text } from '@components/ui'
import cn from 'clsx'
import { inherits } from 'util'
import s from './ProductTag.module.css'

interface ProductTagProps {
  className?: string
  fontSize?: number
}

const ProductTag: React.FC<ProductTagProps> = ({
  children,
  className = '',
  fontSize = 32,
}) => {
  return (
    <div className={cn(s.root, className)}>
      <h3 className={s.name}>{children}</h3>
    </div>
  )
}

export default ProductTag
