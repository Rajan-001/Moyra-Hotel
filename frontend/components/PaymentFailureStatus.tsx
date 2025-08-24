import router from 'next/router'
import React from 'react'
import { IoIosCloseCircleOutline } from 'react-icons/io'


export const PaymentFailureStatus = () => {
  return (
   <div className='w-screen h-screen flex justify-center items-center '>
       <button
        onClick={() => router.push("/")}
        className="absolute top-5 right-5 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
        aria-label="Close"
      >
       <IoIosCloseCircleOutline  className="text-gray-700"/>
      </button>
  <div className="row justify-content-center">
            <div className="col-md-5">
                <div className="message-box _success _failed">
                     <i className="fa fa-times-circle" aria-hidden="true"></i>
                    <h2> Your payment failed </h2>
             <p>  Try again later </p> 
         
            </div> 
        </div> 
    </div> 
  </div>

  )
}