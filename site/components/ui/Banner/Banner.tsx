import Image from 'next/image'
import Button from '../Button'
import s from './Banner.module.css'

const Banner = () => {
  return (
    <div className="w-screen h-[810px] flex relative">
      <Image
        className={s.img}
        src="/assets/tesla1_1440x910.jpg"
        alt="alt"
        layout="fill"
        width={1440}
        height={910}
        quality="100"
      />
      <div className="container w-3/5 flex flex-col absolute top-20 left-20">
        <h2 className="text-accent-0 font-extrabold text-7xl">
          WIN A BRAND NEW CAR BLAH BLAH BLAH
          <br></br>
          <span className="text-secondary"> TESLA BLA</span>
        </h2>

        <div className="flex my-6">
          <Button
            aria-label="Join Now"
            type="button"
            className={s.button}
            disabled={false}
          />
        </div>
      </div>
    </div>
  )
}

export default Banner
