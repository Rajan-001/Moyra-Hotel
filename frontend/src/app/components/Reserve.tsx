import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from './Button'
import Calendar from 'react-calendar'
import { motion } from 'framer-motion'
// import 'react-calendar/dist/Calendar.css'

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
export const Reserve = ({clickFunction}) => {
  const date=new Date();
  console.log(date)
  const[open,setOpen]=useState(false);
   const [value, onChange] = useState<Value>(null);
  console.log(value)
  return (
      <div className='absolute  top-0 right-0 w-[500px] h-[calc(100vh-50px)] mr-1.5  z-10 rounded-[60px]  bg-neutral-700 scale-102'>
          
          <div className='px-8 py-4 h-full w-full '>
          <Image onClick={clickFunction} className='w-6 rotate-45 z-12 h-6 p-1  rounded-full bg-yellow-100' src={'/Svg/cross-sign.svg'} alt={''} width={20} height={20} />
           <div>
            Make it memorable <br/> 
            and reserve one of  <br/>
             our—Capsules®
             </div>
             <div>
              Ready to start your journey too a desert adventure? Secure your capsule by filling out the reservation form.We hope to see you soon!
             </div>
             <div>
              (1) Which capsule you would like to reserve?
             </div>
             <div className='w-full mt-4  grid grid-cols-3 gap-1  text-[10px] text-yellow-50'>
              <div className='h-36 w-36 rounded-3xl bg-stone-900 text-center '>
                <Image unoptimized className='px-1.5 py-1 w-full h-3/4 rounded-3xl object-cover' src={'/Images/cap1.png'} alt={''} width={22} height={20}/>
                 <div className='mt-1.5'>Classic C®</div>
              </div> 
              <div className='h-36 w-36 rounded-3xl bg-stone-900 text-center '>
                <Image unoptimized className='px-2 py-1 w-full h-3/4 rounded-3xl object-cover' src={'/Images/cap1.png'} alt={''} width={22} height={20}/>
                 <div className='mt-1.5'>Classic C®</div>
              </div> 
              <div className='h-36 w-36 rounded-3xl bg-stone-900 text-center '>
                <Image unoptimized className='px-2 py-1 w-full h-3/4 rounded-3xl object-cover' src={'/Images/cap1.png'} alt={''} width={22} height={20}/>
                 <div className='mt-.5'>Classic C®</div>
              </div> 
             </div>

                 <div>
              (2) How long you would like to stay and when?
            </div> 
           
             <div className='w-66 h-40 p-1 rounded-2xl bg-stone-900 text-yellow-100  text-[12px] flex justify-center items-center '>
              
             <Calendar
                onChange={onChange}
                className=" w-full h-full   "
              selectRange={true}
                tileDisabled={({ date }) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0); // Normalize to midnight
                  return date < today;
                }}
              />
             
             </div>

             <motion.div initial={{x:-50,opacity:0,width:0}} animate={{x:"0%",opacity:1,width:"100%"}} transition={{duration:.5}} className='w-full relative mt-8 h-18 bg-stone-800 rounded-4xl flex justify-center items-center'>
              <div className='grid text-center  p-2 w-full h-full  grid-cols-3 space-2 place-content-center justify-center items-center'>
                <div className='text-yellow-50 '>
                  Stay <br/>
                  08.06 - 13.06
                  </div>
                <div>          
                  Cost <br/>
                  10000 USD
                </div>
                <motion.div initial={{opacity:0,width:0}} animate={{opacity:1,width:"100%"}} transition={{delay:.6}} className='flex  justify-center'>
                  <Button clickfunction={()=>setOpen(x=>!x)} positon={'bottom-2 '} text={'Next'} imageSrc={'/Svg/right-arrow.svg'}/>
                </motion.div>
              </div>
             </motion.div>

         </div>

        
          
        </div> 
  )
}