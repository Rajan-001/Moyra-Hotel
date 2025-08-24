import express from "express"
import { Request,Response } from "express"
import cors from "cors"
  
import jwt from "jsonwebtoken"
import { prisma } from "./lib/prisma"
import { userSchema } from "./lib/validation"
import { middleware } from "./routes/middleware"
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import Razorpay from "razorpay";
const crypto = require('crypto');


const app=express()
app.use(express.json())
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"
// app.use(cors({
//   origin: FRONTEND_URL, // allow frontend URL

//   credentials: true
// }));


app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === FRONTEND_URL) {
      callback(null, true);
    } else {
      console.warn("Blocked CORS request from origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

dotenv.config();
app.use(cookieParser())
app.post("/signup",async (req:Request,res:Response)=>{
  
    const parsedData=userSchema.safeParse(req.body)

    try{
      if (!parsedData.data?.name || !parsedData.data?.password) {
        throw new Error("Username and password are not as per requirement");
            }
       const response=await prisma.user.create({
       data:{ name:parsedData.data?.name,
        email:req.body.email,
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
       if (!parsedData.data?.name || !parsedData.data?.password) {
        throw new Error("Username and password are not as per requirement");
            }
       const response=await prisma.user.findFirst({
        where:{
        name:parsedData.data?.name,
        password:parsedData.data?.password
        }
       })
   
        
       if(response&&response.id){
      
          const token=jwt.sign({userId:response.id},process.env.JWT_key!)
        
       res.cookie("token", token, {
            httpOnly: true,   // ✅ cannot be accessed via JS
            secure: false,    // ✅ set to true only if you have HTTPS (you can change later)
            sameSite: "lax" // ✅ prevents CSRF
            });
            
        res.status(200).json({
          message:token
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
            message:"Not able to signIn"
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

app.post("/social-site-signin",async(req:Request,res:Response)=>{
  try{
       const response=await prisma.user.findFirst({
        where:{
               name:req.body.name,
                email:req.body.email,
                provider:req.body.provider
            }
         })
          //@ts-ignore
         const token=jwt.sign({userId:response.id},process.env.JWT_SECRET!)
       res.cookie("token", token, {
            httpOnly: true,   // ✅ cannot be accessed via JS
            secure: false,    // ✅ set to true only if you have HTTPS (you can change later)
            sameSite: "strict" // ✅ prevents CSRF
            });
       res.status(200).json({
        token
       })
    }
    catch(err){
        res.status(404).json({
            Error:err
        })
    }
})


app.post("/hotel-booked",middleware,async (req:Request,res:Response)=>{
    const {hotel_id,tripDuration,checkIn,checkOut,amount}=req.body
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
    console.log(existingBooking)

    if (existingBooking!=null) {
      return res.status(400).json({ message: "Hotel is already booked on selected dates" });
    }
   console.log("Reached here 1")
  const razorpay =await new Razorpay({
        key_id: process.env.RAZORPAY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });
      
    const options = {
      amount: tripDuration * 1000, // amount in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
  
    const order = await razorpay.orders.create(options);
    const {currency,id,status}= order
    const receipt = order.receipt ?? "default-receipt";
    


      const response=await prisma.booking.create({
        data:{
       hotel_id:Number(hotel_id),
       checkIn:new Date(checkIn),
       checkOut:new Date(checkOut),
       //@ts-ignore
       userId:req.id,
       time:tripDuration,
       currency:currency,
       booking_id:id,
       receipt,
       //@ts-ignore
       amount:amount
        },include: {
    Hotels: true,  // optional, to fetch hotel info with booking
    users: true    // optional, to fetch user info with booking
  }

      })
       console.log("hotels",response)
      if(response){
        res.status(200).json({
           response
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

app.post("/verify-payment",middleware, async (req, res) => {
  try {
const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, status } = req.body;
   console.log(razorpay_order_id)
   console.log(orderId)
    // 🔐 Create the signature to compare with Razorpay’s
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
   console.log("control reachere in verify payment")
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    console.log("Generated Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

    if (expectedSignature === razorpay_signature) {
      console.log("✅ Payment Verified");

      const payment = await prisma.payments.create({
        data: {
          // coming from frontend
          razorpay_order_id: razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id,
          razorpay_signature: razorpay_signature,
          status: "success", // from your enum Status (SUCCESS, REFUNDED, FAILED)
          paymentDate:new Date(),
          order: {
      connect: { booking_id: orderId }
       },
       UserInfo:{
        connect:{
        //@ts-ignore
          id:req.id
        }
       }

        },
      });
            console.log(payment)
      // 👉 Here you can update DB to mark the order as PAID
      return res.status(200).json({ success: true });
    } else {
      console.log("❌ Signature mismatch! Possible fraud");
      return res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error("❌ Verification Error:", error);
    return res.status(500).json({ success: false});
  }
});

app.get("/hotels/:id",async (req:Request,res:Response)=>{
    const hotel_id=Number(req.params.id)
    try{
      console.log(hotel_id)
      const response=await prisma.booking.findFirst({
       where:{ hotel_id:hotel_id }
      })
      console.log("hotel booking",response)
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

app.post("/get-hotel-booking",async(req:Request,res:Response)=>{
  const {orderId}=req.body
  try{
 
    const book= await prisma.booking.findUnique({
      where:{
       id:Number(orderId)
      },
       include: {
    Payments:true
  },
    })
   console.log(book)
    if(book)
    {
    res.status(200).json( 
      {book}
      )
     }
   else{
      res.status(411).json({
        Message:"Not able to send orderId"
      })
    }
  }
  
  catch(err){
    res.status(503).json(err)
  }
})


// app.listen(8000,()=>{ console.log("server is running at 8000")})

const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});