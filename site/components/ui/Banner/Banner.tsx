import Image from 'next/image'
import Button from '../Button'
import s from './Banner.module.css'

const Banner = () => {
  return (
    <div className="w-full h-32 flex">
      <Image
        className={s.img}
        src="/assets/tesla.jpg"
        alt="alt"
        layout="fill"
        width={800}
        height={600}
        quality="100"
      />
      <Button
        aria-label="Join Now"
        type="button"
        className={s.button}
        disabled={false}
      />
    </div>
  )
}

export default Banner
