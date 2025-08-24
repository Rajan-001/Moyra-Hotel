"use client"
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


export default   function ConfirmationPage  () {
  const [checkIn,setCheckIn]=useState("")
  const [checkOut,setCheckOut]=useState("")  
  const[totalTime,setTotalTime]=useState(0)
  const [userName,setUserName]=useState("")
  const[amount,setAmount]=useState(null)
//@ts-ignore  
    const searchParams = useSearchParams();

  const order_Id = searchParams.get("orderId");
 const router=useRouter();
 
  useEffect(()=>{
   if (!order_Id) return; 
    fetchingOrderDetail(order_Id)

   async function fetchingOrderDetail(order_Id:any)
   {
     const response=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-hotel-booking`,{
        method:"POST",
        credentials: "include",
        headers:{
         "Content-Type": "application/json"
        },
        body:JSON.stringify({orderId:order_Id})
      }); 
       console.log(order_Id)
      const data=await response.json();
      if(response.status==200)
      {
      console.log(data)
      const date1 = new Date(data.book.checkIn).toISOString().split("T")[0];
          const date2 = new Date(data.book.checkOut).toISOString().split("T")[0];
     const time=data.book.time;
    const cost=data.book.amount
     console.log("confirmation",data)
     setCheckIn(date1)
     setCheckOut(date2)
     setTotalTime(time)
   setAmount(cost)
    console.log("hello i am gere")
      }
      else{
        console.log("failed")
      }
   }

  },[order_Id])

  

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-4xl p-8 space-y-6">
        
        
        {/* Header Info */}
        <div className="flex justify-between text-lg font-semibold text-gray-700">
          <div>
            Recipient ID: <span className="font-normal">#12345</span>
          </div>
            <div>
            Username: <span className="font-normal">{userName}</span>
          </div>
          <div>
            Hotel Location: <span className="font-normal">New York</span>
          </div>
        </div>

        <div className="border-t border-gray-300" />

        {/* Hotel Image & Details */}
        <div className="grid grid-cols-3 gap-6 items-center">
          {/* Image */}
          <div className="col-span-1">
            <img
              src="https://images.unsplash.com/photo-1501117716987-c8e1ecb210f4?w=800&q=80"
              alt="Hotel"
              className="w-full h-40 object-cover rounded-lg shadow"
            />
          </div>

          {/* Hotel Info */}
          <div className="col-span-2 space-y-2">
            <h2 className="text-xl font-bold text-gray-800">Grand Hotel</h2>
            <p className="text-gray-600">Times Square, New York</p>
            <p className="text-sm text-gray-500">
              {checkIn} — {checkOut} • {totalTime} Nights
            </p>
            <p className="text-gray-700 font-semibold">$1000 / night</p>
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <div className="text-lg font-semibold text-gray-700 mb-2">
            Payment Details
          </div>
          <div className="border-t border-gray-300" />
          <div className="flex justify-between mt-3 text-gray-700">
            <div>Booking Fee</div>
            <div className="font-semibold">${amount}</div>
          </div>
        </div>

        {/* Pay Button */}
        <div className='flex justify-between'>
        <div className=" ">
          <button onClick={()=>router.push("/dashboard")} className="px-6 py-2 cursor-pointer bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-800 transition">
            Home
          </button>
        </div>
       <div className="">
          <button  className="px-6 py-2 cursor-pointer bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
            Paid
          </button>
        </div>
        </div>
       


      </div>
    </div>
  );
};

