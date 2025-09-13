import React, { use, useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from './Button'
import Calendar from 'react-calendar'
import { motion } from 'framer-motion'
import { response } from 'express'
import { useRouter } from 'next/navigation'

// import 'react-calendar/dist/Calendar.css'

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
export const Reserve = ({clickFunction}:{clickFunction:any}) => {
  const date=new Date();
  const[open,setOpen]=useState(false);
  const router = useRouter();
  const [hotels, setAllHotels] = useState<any[]>([]);
  const [loaded,setLoaded]=useState(false)
  const[selectHotel,setHotel]=useState(1);
  const[startDate,setStartDate]=useState("");
  const[endDate,setEndDate]=useState("")
  const[cost,setCost]=useState(1000)
  const[ranges,setDaterange]=useState<[Date|null,Date|null]>([null,null])
 const[numberOfDays,setNumberofDays]=useState(0)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failed">("idle");

   useEffect(()=>{
      const date1=new Date(`${ranges[0]}`)
   const day1 = date1.getDate(); // 20
    const month1 = date1.toLocaleString("en-US", { month: "short" }); // "Aug"
    const result1 = `${day1} ${month1}`;
     setStartDate(result1)

       const date2=new Date(`${ranges[1]}`)
   const day2 = date2.getDate(); // 20
    const month2 = date2.toLocaleString("en-US", { month: "short" }); // "Aug"
    const result2 = `${day2} ${month2}`;
     setEndDate(result2)

     const currentDate=new Date(`${ranges[0]}`)
     let noOfDays=1;
     while(currentDate<date2 ){
    noOfDays++;
    currentDate.setDate(currentDate.getDate()+1)
     }
      setCost(noOfDays*1000)
    setNumberofDays(noOfDays)
      },[ranges])

      useEffect(()=>{
       const firstDate=new Date()
        const day1 = firstDate.getDate(); // 20
    const month1 = firstDate.toLocaleString("en-US", { month: "short" }); // "Aug"
    const result1 = `${day1} ${month1}`

       setStartDate(result1)
       setEndDate(result1)
      },[])
      
  async function handleSelectRange(value:any){
    setDaterange(value) 
}

 async function bookingHotel(){
    if (Array.isArray(ranges) && ranges[0] && ranges[1]) {
     
       
      const response=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hotel-booked`,{
        method:"POST",
        credentials: "include",
        headers:{
         "Content-Type": "application/json"
        },
        body:JSON.stringify({hotel_id:selectHotel,checkIn:ranges[0],checkOut:ranges[1],tripDuration:numberOfDays,amount:cost*numberOfDays})
      });   
      if (response) {
       
       
        if(response.status===503){

          router.push("/profile")
        }
        else if(response.status===200){
          const data =await response.json();
          console.log("Response",data.response)
               console.log("✅ Order Created:", data.response.id);
              
                // ✅ 2️⃣ Open Razorpay checkout
                const options = {
                  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, // ✅ Public Key (from Razorpay Dashboard)
                  amount: cost*numberOfDays,
                  currency: "INR",
                  name: `Hotel`,
                  description: `Payment for ${data.response.id} Plan`,
                  order_id: data.response.booking_id, // ✅ Razorpay order_id from backend
                  handler: async function (response: any) {
                    console.log("✅ Razorpay Response:", response.razorpay_signature);
                    console.log("booking_Id",data.response.booking_id)
                    console.log("status",data.response.status)
                    console.log("Rajorpay order Id",response.razorpay_order_id)
                    console.log("Rajorpay payment Id",response.razorpay_payment_id)
                    console.log("Rajorpay signature",response.razorpay_signature)
                    // ✅ 3️⃣ Send payment details to backend for signature verification
                    const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/verify-payment`, {
                      method: "POST",
                        credentials: "include",
                      headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: data.response.booking_id,   // 👈 comes from backend when creating order
                        status: data.response.status       // 👈 you can send CREATED or SUCCESS etc.
                      }),
                    });

                    const {success} = await verifyRes.json();
                    console.log(success)
                   if (success === true) {
                     router.push(`/confirmation?orderId=${data.response.id}`)
                    setPaymentStatus("success");

                  } else {
                    setPaymentStatus("failed");
                  }
                  },
                  theme: {
                    color: "#3399cc",
                  },
                };

                // @ts-ignore
                 const rzp = new window.Razorpay(options);
                rzp.open();
              
          
        }
      }
  }
   
 }

 useEffect(() => {
  async function fetchHotels() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-hotels`);
    const data = await response.json();
    setHotel(1)
    setAllHotels(data);
    setLoaded(true);
  }
  fetchHotels();
   const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
   script.onload = () => console.log("✅ Razorpay script loaded");
  document.body.appendChild(script);
}, []); 

useEffect(() => {
  async function fetchHotelDetail() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hotels/${selectHotel}`);
    const detail = await response.json();
    console.log("Selected hotel detail:", detail);
  }
  fetchHotelDetail();
}, [selectHotel]); 

  return (
      <div className='absolute  top-0 right-0 w-[500px] h-[calc(100vh-50px)] mr-1.5  z-10 rounded-[60px]  bg-neutral-700 scale-102'>
          { loaded &&
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
              {  hotels.map((x,i)=>(

              <div key={i} onClick={()=>{setHotel(i+1)}} className='h-36 w-36 rounded-3xl bg-stone-900 text-center hover:bg-yellow-100 hover:text-stone-900 cursor-pointer'>
                <Image unoptimized className='px-1.5 py-1 w-full h-3/4 rounded-3xl object-cover' src={'/Images/cap1.png'} alt={''} width={22} height={20}/>
                 <div className='mt-1.5'>{x.hotel_name}</div>
              </div> 
            
              )
            )
               }
             </div>

                 <div>
              (2) How long you would like to stay and when?
            </div> 
           
             <div className='w-66 h-40 p-1 rounded-2xl bg-stone-900 text-yellow-100  text-[12px] flex justify-center items-center '>
              
             <Calendar
                 onChange={handleSelectRange}
                className=" w-full h-full   "
              selectRange={true}
              value={ranges}
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
                  {startDate} - {endDate}
                  </div>
                <div className='text-yellow-50'>          
                  Cost <br/>
                  {cost} USD
                </div>
                <motion.div onClick={bookingHotel} initial={{opacity:0,width:0}} animate={{opacity:1,width:"100%"}} transition={{delay:.6}} className='flex justify-center'>
                  <Button clickfunction={()=>setOpen(x=>!x)} positon={'bottom-2 '} text={'Next'} imageSrc={'/Svg/right-arrow.svg'}/>
                </motion.div>
              </div>
             </motion.div>

         </div>
              }
        </div> 
  )
}
