import React, { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

const Sentence=" Welcome to a world of wild California desert with Capsules®, where you will discover exquisite nature from capsule houses nestled in one of the most breathtaking destinations in the United States."

export const TextReveal = () => {
    const container=useRef(null)
    const {scrollYProgress}=useScroll({
  target: container,
   offset:["start end","end 0.9"]

});
    const word=Sentence.split("")
   
    return (
    <div className='w-screen h-[calc(100vh+200px)] overflow-hidden relative'>
          
             <div  ref={container} className='text-6xl px-12 leading-20 pt-24 w-full h-full'>
           {
           [...word].map((x,i)=>{
            const start=i/word.length
            const end=start+(1/word.length)
           
            return(<Word key={i} range={[start,end]} progress={scrollYProgress} >  {x} </Word>)
           })
           }
            </div>
          
         <div className='flex absolute bottom-10  mx-16 place-content-center justify-between h-44  overflow-x-hidden'>
          <div className='grid grid-cols-2  w-full h-full'>
            <Image unoptimized className='h-full w-auto rounded-full' src={'/Images/fireborn.png'} width={100} height={100} alt={''}/>
             <Image unoptimized className='h-full w-auto rounded-full' src={'/Images/mountainWithStar.png'} width={100} height={100} alt={''}/>
          </div>
          <div className='text-yellow-100 flex mx-12 justify-center items-center  text-3xl '>
           A place where you can be with yourself and your loved ones.
           A place where you can experience unforgettable desert things.
          </div>
          </div>
   
         </div>
  )
}

export function Word({children,progress,range}){
const opacity=useTransform(progress,range,[0,1])
const char=children[1]

return <div className='inline-block '>
    <motion.span className='text-yellow-100  w-[0.5ch] absolute ' style={{opacity}}> {char === " " ? "\u00A0" : char}</motion.span>
    <span className='text-neutral-900 w-[0.5ch]  '>   
      {char === " " ? "\u00A0" : char}
     </span>
</div>
}