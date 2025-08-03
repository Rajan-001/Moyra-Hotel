"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import Calendar from 'react-calendar';
import { Menu } from './Menu';
import { ImagePage } from './ImagePage';
import { Button } from './Button';
import { TextReveal } from './TextReveal';
import { CapsuleBooking } from './CapsuleBooking';
import { Reserve } from './Reserve';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
export const LandingPage = () => {
  const [date, onChange] = useState<Value>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [openMenu,setOpenMenu]=useState(false)
 const [openReserve,setOpenReserve]=useState(false)

  useEffect(() => {
    setIsHydrated(true);
    onChange(new Date());
  }, []);

  if (!isHydrated) return null;
  
  return (
    <div className='bg-neutral-950 w-screen overflow-hidden'>

    <div className='w-screen h-screen flex z-4 '>
        <div className='m-3 w-[calc(100vw-24px)] h-[calc(100vh-24px)]  rounded-[42px]   border-2 relative'>
          
           {
        openMenu && <Menu/>
       }

           <Image unoptimized  src="/Images/cap1.png" width={300} height={300} className='w-full h-full object-cover rounded-[42px] overflow-hidden ' alt='Landing Page'/>
        {!openMenu && <div className='absolute left-12 top-11 z-2 '>
          <Image src="/Svg/Logo.svg" className='w-[820px]' width={100} height={50} alt='Logo'/>
        </div>}
      
      <div className='z-4'>
        <Button positon={'top-6 right-2'} text={'Reserve'} imageSrc={"/Svg/northeast.svg"} clickfunction={()=>setOpenReserve(x=>!x)}/>
        </div>
        {
          openReserve && <Reserve  clickFunction={()=>setOpenReserve(false)}/> 
        }

       {!openMenu &&  <div className='w-full flex justify-between z-4 absolute bottom-12 text-yellow-50 px-4'>
          <div><p className='text-2xl leading-[28px] font-bold'>Closer to <br/> Nature—Closer <br/> to Yourself</p></div>
          <div className='text-sm mt-8 flex align-text-bottom'><p>Spend unforgettable and remarkable time <br/>     
           in the Californian desert with—Capsules.</p>
           </div>
        </div>
          } 
       <Button  positon={'left-2/4 bottom-6 '} clickfunction={()=>  setOpenMenu(x=>!x)} text={'Menu'} imageSrc={'/Svg/HomeButtonChevron.svg'}/> 
      
        </div> 
    </div>
 
      <TextReveal/>

    <ImagePage/>
     <CapsuleBooking/>   
   
      
      
    </div>
  )
} 