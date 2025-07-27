import express from "express"
import { Request,Response } from "express"
import cors from "cors"
  
import jwt from "jsonwebtoken"
import { prisma } from "./lib/prisma"
import { userSchema } from "./lib/validation"
import { middleware } from "./routes/middleware"



const app=express()
app.use(express.json())
app.use(cors({
  origin: "http://localhost:3000", // allow frontend URL
  methods: ["GET", "POST"],
  credentials: true
}));


app.post("/signup",async (req:Request,res:Response)=>{
  
    const parsedData=userSchema.safeParse(req.body)

    try{
      if (!parsedData.data?.username || !parsedData.data?.password) {
        throw new Error("Username and password are not as per requirement");
            }
       const response=await prisma.user.create({
       data:{ username:parsedData.data?.username,
        password:parsedData.data?.password }
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

app.post("/signin",async (req:Request,res:Response)=>{
     const parsedData=userSchema.safeParse(req.body)
    try{
       if (!parsedData.data?.username || !parsedData.data?.password) {
        throw new Error("Username and password are not as per requirement");
            }
       const response=await prisma.user.findFirst({
        where:{
        username:parsedData.data?.username,
        password:parsedData.data?.password
        }
       })

  
       if(response){
          const token= await jwt.sign(response,process.env.JWT_key!)
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

app.get("/checked",async (req:Request,res:Response)=>{
 const {hotel_id}=req.body
    try{
      
      const response=await prisma.booking.findFirst({
        where:{
         hotel_id:hotel_id  
        },
       include:{users:true}
      }
      )
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

app.post("/hotel-booked",middleware,async (req:Request,res:Response)=>{
    const {hotel_id,checkIn,checkOut}=req.body
    try{
       
         const existingBooking = await prisma.booking.findFirst({
      where: {
        hotel_id,
        OR: [
          {
            checkIn: { lte: new Date(checkOut) },
            checkOut: { gte: new Date(checkIn) },
          },
        ],
      },
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Hotel is already booked on selected dates" });
    }
      const response=await prisma.booking.create({
        data:{
       hotel_id:hotel_id,
       checkIn:checkIn,
       checkOut:checkOut,
       //@ts-ignore
       userId:req.id
        }
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

app.get("/hotels/:id",async (req:Request,res:Response)=>{
    const hotel_id=Number(req.params.id)
    try{
      console.log(hotel_id)
      const response=await prisma.booking.findFirst({
       where:{ hotel_id:hotel_id }
      })
      console.log(response)
      if(response){
        res.status(200).json({
            message:"Able to book"
        })
      }
      else{
        res.status(207).json({
            message:"No Booking "
        })
      }
    }
    catch(err){
        res.status(503).json({
            message:"Not able to book now"
        })
    }
})

app.get("/user-booking",middleware,async (req:Request,res:Response)=>{
   
    try{
      
      const response=await prisma.booking.findFirst({
        //@ts-ignore
     where:{  userId:req.id },
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

app.get("/get-hotels",async (req:Request,res:Response)=>{
 try{
    const hotels=await prisma.hotels.findMany({
        include:{
         place: true,  
        booking: true 
        }
    })
    res.json(hotels)
 }
 catch(err){
    res.status(503).json({
        message:"Internal Server Error"
    })
 }
})



app.listen(8000,()=>{ console.log("server is running at 8000")})