import React from 'react'
import Image from 'next/image'
type Props = {}

export const MaskingImage = (props: Props) => {
  return (
    <div className="w-screen h-screen bg-white grid place-content-center">
     <div className="w-94 h-24 rounded-[45px] relative border-amber-100 p-2 border-2">
     
      <Image
        unoptimized
        className="w-full h-full object-cover mask-img"
        src={"/Images/cap3.png"}
        width={50}
        height={50}
        alt=""
      />
    </div>
         </div>
  )
}