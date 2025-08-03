import React, { useState } from 'react'
import Image from 'next/image'
import {  AnimatePresence, motion } from 'framer-motion'


export const CapsuleBooking = () => {
  const[open,setOpen]=useState(false)

  return (
      <div className='w-screen h-screen flex my-8 mx-6 relative' >
           <div className='w-full h-full rounded-[40px] py-4'>
           <Image className='w-full h-full rounded-[70px] object-cover' unoptimized src={'/Images/cap2.png'} width={20} height={30} alt='' />
           </div>
           
           <div className='absolute top-1/2 left-8 line-clamp-2 text-7xl text-yellow-100'>
             Terrace Capsule®
           </div>
          
            <div className='absolute bottom-12 left-2 flex flex-row ml-10'>
              <Image onClick={()=>setOpen(x=>!x)} className='z-4 cursor-pointer rounded-full w-8 h-8 mt-2 p-2 bg-pink-900 ' width={20} height={20} alt='' src={'/Svg/plus-icon.svg'} />
              <div className='text-yellow-100 ml-4'>
               The most prestige capsule with the biggest terrace <br/>
               and jacuzzi with an amazing view of Los Angeles.
             </div>
            </div>
            <AnimatePresence>
                { open &&        
             <motion.div key="modal" exit={{ opacity: 1 }} initial={{opacity:0,y:50}} animate={{opacity:1,y:"0%"}} transition={{duration:.5}} className='h-[570px] z-2 w-92 bg-neutral-700 absolute left-8 top-12 rounded-[42px] '>
               
               <div className='px-8 h-full text-yellow-50 relative '>
               <div className='  flex justify-between flex-row mt-12  '>
                 <div className=' text-sm py-2'>
                   Details <br/>
                  (Terrace Capsule®)
                 </div>
                 <div className='flex justify-end'>
                   <Image unoptimized className='w-28 h-14 rounded-xl object-cover' src={'/Images/cap2.png'} width={20} height={30} alt={''}/>
                 </div>
               </div>
                
                
                <div className='text-[10px] mt-6'>
                 The most prestige capsule with the biggest terrace <br/>
                  and jacuzzi with an amazing view of Los Angeles.
                </div>
   
                 <div className='flex justify-between pt-4 pb-1 text-xs'>
                   <div>Square footage</div>
                   <div>30m2</div>
                 </div>
                  <hr className='border-1'/>
   
                  <div className='flex justify-between pt-2 pb-1 text-xs'>
                   <div>Bed</div>
                   <div>King Size</div>
                 </div>
                  <hr className='border-1'/>
   
                  <div className='flex justify-between pt-2 pb-1 text-xs'>
                   <div>Shifting Window</div>
                   <div>Availabe</div>
                 </div>
                  <hr className='border-1'/>
   
                    <div className='flex justify-between pt-2 pb-1 text-xs'>
                   <div>Air Condition</div>
                   <div>Availabe</div>
                 </div>
                  <hr className='border-1'/>
   
                  <div className='flex justify-between pt-2 pb-1 text-xs'>
                   <div>Jacuzzi</div>
                   <div>Availabe</div>
                 </div>
                  <hr className='border-1'/>
     
                 <div className='flex justify-between pt-2 pb-1 text-xs'>
                   <div>Terrace</div>
                   <div>Availabe</div>
                 </div>  
   
                  <div className='w-fit overflow-hidden pt-2 pb-1 text-xs'>
                   Ready to Reserve
                   <ul className='border-1' />
                   </div>           
                  
                  <div className='mt-32 rounded-3xl w-full  h-14 bg-neutral-950 flex  '>
                     <div className='flex w-full px-4 justify-between items-center text-xs '>
                       <div>
                         Cost
                       </div>
                       <div>
                         2550 USD / Night
                       </div>
                     </div>
                   </div> 
   
                </div>
             </motion.div> 
                }
                </AnimatePresence>
         </div>
  )
}