import React from 'react'
import Image from 'next/image'
import { Button } from './Button'
import { easeInOut, motion } from 'framer-motion'

 const Nav=[ "Welcome","Introduction","Houses","Why Capsule","Activites","Feedback"]
const socialIcons = [
  {
    src: '/Svg/linkdedn.svg',
    alt: 'LinkedIn',
  },
  {
    src: '/Svg/Instagram.svg',
    alt: 'Instagram',
  },
  {
    src: '/Svg/Dribble.svg',
    alt: 'Dribbble',
  },
  {
    src: '/Svg/Behance.svg',
    alt: 'Behance',
  },
];
export const Menu = () => {
  return (
     <motion.div 
      initial={{ y: "100%", opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}       
        transition={{ duration: 0.8, ease: "easeOut" }}
      className='w-full h-full bg-neutral-600 rounded-[42px]  '>
            <div className='grid grid-cols-2 '>
           
                  <div className=' pl-8 pt-8  relative h-[calc(100vh-36px)]    z-9'>
                    <div className='grid overflow-hidden  grid-rows-6 h-[calc(100%-100)px]  text-7xl   text-yellow-100 gap-y-0.5 '>
                    {
                      [...Nav].map((x,i)=>{
                        return( <motion.div key={i}
                    initial={{ y: "-50%", opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }}       
                  transition={{ delay:i*.20,duration: .5, ease:"anticipate" }}
                    className='row-span-1 overflow-y-hidden'
                    >
                      {x}
                     
                      </motion.div>)

                      })
                    }
                    </div>

                    <div className='flex justify-between absolute w-[620px] bottom-10 pl-4 flex-row text-yellow-50'>
                      <div className='flex flex-row '>
                      {socialIcons.map((icon, index) => {
                      return <motion.div
                      initial={{ x:0, opacity: 0 }} 
                  animate={{ x: "20%", opacity: 1 }}       
                  transition={{ delay:index*.3,duration: 1, ease: "easeOut" }}
                      key={index} >
                      <Image
                        key={index}
                        className="h-10 w-10 p-2 rounded-full bg-transparent border border-yellow-100"
                        priority
                        src={icon.src}
                        width={30}
                        height={30}
                        alt={icon.alt}
                      />
                      </motion.div>
                    })
                  }
                    </div>
                     <div className="text-[10px] leading-3 mt-4 font-bold text-neutral-900">
                      <p>
                        This website is just concept work<br />
                        done by—Moyra to showcase our capabilities.
                      </p>
                    </div>
                    </div>

                  </div>


                  <motion.div initial={{opacity:0,x:"100%"}} animate={{opacity:1,x:0}} transition={{ delay:0.5,duration:1,ease:"backInOut"}}  className=' p-4 flex relative justify-end overflow-hidden'>
                  <div className='w-3/5 h-full relative overflow-hidden text-yellow-100'>
                  <Image unoptimized  quality={100} className='w-full h-full rounded-4xl  object-cover' width={200} height={200} src={'/Images/cap2-square.jpeg'} alt={'cap-2 mobile'}/>
                     
                    <p className="text-[200px] ml-12 absolute top-1/4 scroll-track  ">Capsule</p>
                    <p className="text-[200px]  absolute top-1/4 scroll-tracku">Capsule</p>
                  
                  </div>
                  </motion.div>
                  
                  <div></div>
              
            </div>
           </motion.div>
  )
}