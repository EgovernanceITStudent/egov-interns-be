import { Request,Response,NextFunction } from "express";
import  jwt  from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()
export class Middleware{
    constructor(){}
    public authchecker(req:Request,res:Response,next:NextFunction){
        let data = req.cookies.token
        console.log("cookie" + data)
        if(data){
            jwt.verify(data,process.env.SECRETKEY as string,(err:any,user:any)=>{
                if(err){
                    res.status(403)
                }
                console.log("user data" + user)
                req.customData = user;
                next()
            })
        }else{
            res.status(404).json({
                message:"you are not logged in"
            })
        }
    }
}