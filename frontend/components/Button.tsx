import React from 'react'
import Image from 'next/image'

export const Button = ({positon,text,imageSrc,clickfunction}: {positon:string,text:string,imageSrc:string,clickfunction:()=>void}) => {
  return (
    <div onClick={clickfunction} className={`cursor-pointer bg-yellow-50 absolute flex w-auto h-auto ${positon}  rounded-full justify-between items-center place-content-center `}>
               <div className='text-sm ml-8 mr-4 my-4'> {text}</div>
               <div className='bg-neutral-900 rounded-full w-[44px] h-[44px] mr-2 py-1'>
                 <Image src={`${imageSrc}`} className='w-full h-full p-2.5' width={12} height={12} alt='Logo'/>
               </div>
            </div>
  )
}