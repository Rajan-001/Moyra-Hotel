import router from 'next/router'
import React from 'react'
import { IoIosCloseCircleOutline } from 'react-icons/io'

type Props = {}

export const PaymentSuccessfulStatus = (props: Props) => {
  return (
   
   <div className="w-screen h-screen flex justify-center items-center ">
      <button
        onClick={() => router.push("/")}
        className="absolute top-5 right-5 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
        aria-label="Close"
      >
       <IoIosCloseCircleOutline  className="text-gray-700"/>
      </button>
        <div className="row justify-content-center w-96 h-96">
            <div className="col-md-5">
                <div className="message-box _success">
                     <i className="fa fa-check-circle" aria-hidden="true"></i>
                    <h2> Your payment was successful </h2>
                   <p> Thank you for your payment. we will <br/>
be in contact with more details shortly </p>      
            </div> 
        </div> 
    </div> 
</div>
  )
}