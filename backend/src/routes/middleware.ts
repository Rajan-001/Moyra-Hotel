
import  jwt  from "jsonwebtoken"
import { Request,Response,NextFunction } from "express"

export  async function middleware(req:Request,res:Response,next:NextFunction)
    {
   const token= req.headers["authorization"]??"" 
   const decoded=jwt.verify(token,process.env.JWT_key!)
   if(decoded){
    //@ts-ignore
    req.id=decoded.id
    next()
   }
   else{
    res.status(411).json({
        message:"Token is not valida"
    })
   }

}