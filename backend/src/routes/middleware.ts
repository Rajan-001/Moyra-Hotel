
import  jwt  from "jsonwebtoken"
import { Request,Response,NextFunction } from "express"
import cookieParser from "cookie-parser"


export  async function middleware(req:Request,res:Response,next:NextFunction)
    {
        try{
           
    const token = req.cookies.token;
   
    if(token!=undefined){
    const decoded=jwt.verify(token,process.env.JWT_key!)
    if(decoded){
        //@ts-ignore
        req.id=decoded.userId
        console.log(decoded)
        next()
    }
    else{
        res.status(411).json({
            message:"Token is not validated"
        })
    }
    }
    else{
        res.status(503).json({
            message:"Token is undefined"
        })
    }
   }
   catch(err){
     res.status(503).json({
            message:"Not able to get token"
        })
   }
   

}