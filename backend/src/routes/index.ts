import express from "express"
import { Request,Response } from "express"
import { prisma } from "../lib/prisma/src"
import { userSchema } from "../lib/validation"
import jwt from "jsonwebtoken"
import { middleware } from "./middleware"

const app=express()
app.use(express.json())

app.post("/signup",(req:Request,res:Response)=>{
  
    const parsedData=userSchema.safeParse(req.body)
    try{
       const response=prisma.user.create({
        userName:parsedData.data?.name,
        password:parsedData.data?.password
       })
       if(response){
        res.status(200).json({
            message:"Able to Sign Up"
        })
       }
       else{
        res.status(400).json({
            message:"Not able to create user in Db"
        })
       }
    }
    catch(err){
        res.status(503).json({
            message:"Not able to signup"
        })
    }
})

app.post("/signin",(req:Request,res:Response)=>{
     const parsedData=userSchema.safeParse(req.body)
    try{
       const response=prisma.user.findfirst({
        userName:parsedData.data?.name,
        password:parsedData.data?.password
       })
       const token=jwt.sign(response,process.env.JWT_key!)
       if(response){
        res.status(200).json({
           token
        })
       }
       else{
        res.status(400).json({
            message:"Not able to create user in Db"
        })
       }
    }
    catch(err){
        res.status(503).json({
            message:"Not able to signup"
        })
    }
})

app.get("/checked",(req:Request,res:Response)=>{

})

app.post("/booked",middleware,(req:Request,res:Response)=>{
    const {hotel_id,checkIn,checkOut}=req.body
    try{
        const data=prisma.hotels.findfirst({
            hotel_id:hotel_id
        })
      const response=prisma.booking.create({
       hotel_id:data.hotel_id,
       checkIn:checkIn,
       checkOut:checkOut,
       userId:req.id
      })
      if(response){
        res.status(200).json({
            message:"Able to book"
        })
      }
      else{
        res.status(400).json({
            message:"Not Booked"
        })
      }
    }
    catch(err){
        res.status(503).json({
            message:"Not able to book now"
        })
    }
})

app.get("/hotel-booking",(req:Request,res:Response)=>{
    const {hotel_id}=req.body
    try{
      
      const response=prisma.booking.findfirst({
       hotel_id:hotel_id,
      })
      if(response){
        res.status(200).json({
            message:"Able to book"
        })
      }
      else{
        res.status(400).json({
            message:"Not Booked"
        })
      }
    }
    catch(err){
        res.status(503).json({
            message:"Not able to book now"
        })
    }
})

app.get("/user-booking",middleware,(req:Request,res:Response)=>{
   
    try{
      
      const response=prisma.booking.findfirst({
       userId:req.id,
      })
      if(response){
        res.status(200).json({
            message:"Able to book"
        })
      }
      else{
        res.status(400).json({
            message:"Not Booked"
        })
      }
    }
    catch(err){
        res.status(503).json({
            message:"Not able to book now"
        })
    }
})



app.listen(8001,()=>{ console.log("server is running at 8001")})