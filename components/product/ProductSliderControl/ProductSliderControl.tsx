import { FC, MouseEventHandler, memo } from 'react'
import cn from 'clsx'
import s from './ProductSliderControl.module.css'
import { ArrowLeft, ArrowRight } from '@components/icons'

interface ProductSliderControl {
  onPrev: MouseEventHandler<HTMLButtonElement>
  onNext: MouseEventHandler<HTMLButtonElement>
}

const ProductSliderControl: FC<ProductSliderControl> = ({ onPrev, onNext }) => (
  <div className={s.control}>
    <Arrow onClick={onPrev} left />
    <Arrow onClick={onNext} />
  </div>
)

function Arrow(props: { left?: boolean; onClick: (e: any) => void }) {
  return (
    <svg
      onClick={props.onClick}
      className={props.left ? s.leftControl : s.rightControl}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  )
}

export default memo(ProductSliderControl)
