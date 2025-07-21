import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';
import { animate } from 'framer-motion';

  let xPercent = 0;
export const ImagePage = () => {
const firstText=useRef(null)
const secondText=useRef(null)
const thirdText=useRef(null)
const fourthText=useRef(null)

  function animate(){
  
    if(xPercent<-100)
    {
      xPercent=0
    }else if(xPercent > 0){
      xPercent = -100;
    }
    gsap.set(firstText.current,{xPercent:xPercent})
     gsap.set(secondText.current,{xPercent:xPercent})
      gsap.set(thirdText.current,{xPercent:xPercent})
       gsap.set(fourthText.current,{xPercent:xPercent})
  xPercent+=-0.2
   requestAnimationFrame(animate);

  }

  useEffect(()=>{
    requestAnimationFrame(animate)
  })
  return (
     <div className='w-screen h-[calc(100vh+400px)]  relative ' >
          
          <div className='relative px-12  w-full  h-[calc(100vh-500px)]'>
           <div className='text-xs text-yellow-100'>Discover available Capsules®</div>
           <div className='text-[120px] leading-32 text-yellow-100'>Choose the one you like best</div>
            <div className='grid grid-cols-2 mt-18 w-full h-full'>
               <div className='text-yellow-50 text-4xl'>
                 You can choose one of three premium capsule houses in our offer. Each of our capsules provides the highest quality and meets the standards adjusted to your needs. Choose the one you like.
               </div>
               <div className=' flex flex-col'>
                <div className='text-xs block text-yellow-100'>
                 All Capsules® houses—has built
                 based on the same rules:
                </div>
                <div className='flex mt-8 flex-wrap flex-row-2 text-yellow-50 '>
                   <div className='text-3xl  w-fit m-4 h-fit rounded-[36px] p-3.5 border-1'>Sustainable</div>
                   <div className='text-3xl w-fit m-4 h-fit rounded-[36px] p-3.5 border-1'>Nature-Care</div>
                   <div className='text-3xl w-fit m-4 h-fit rounded-[36px] p-3.5 border-1'>Smart</div>
                   <div className='text-3xl w-fit m-4 h-fit rounded-[36px] p-3.5 border-1'>Privacy</div>
                   <div className='text-3xl w-fit m-4 h-fit rounded-[36px] p-3.5 border-1'>Spacious</div>
                   <div className='text-3xl w-fit m-4 h-fit rounded-[36px] p-3.5 border-1'>Glassed-In</div>
                </div>
               </div>
            </div>
          </div>
            

             <div className='  h-76  w-120 flex absolute bottom-0 left-1/4 right-1/2 place-content-center'>
               <Image unoptimized className='w-140 z-4 h-76 flex rounded-[52px] object-cover aspect-video' src={'/Images/cap3.png'} width={20} height={30} alt=''/>
                  
             </div>
            <div className="absolute h-52 bottom-12   overflow-hidden w-full text-yellow-100">
           <div className=" text-[130px] z-0 absolute  flex flex-row   whitespace-nowrap">
      
            <p className='mx-2' ref={firstText}>Capsules</p>
            <p className='mx-2' ref={secondText}>Capsules</p>
             <p className='mx-2' ref={thirdText}>Capsules</p>
            <p className='mx-2' ref={fourthText}>Capsules</p>
    
          </div>
       
        </div>

         </div>
  )
}