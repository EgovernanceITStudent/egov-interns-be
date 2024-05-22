import { Request,Response,NextFunction } from "express";
import  jwt  from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()
export class Middleware{
    constructor(){}
    public async authchecker(req:Request,res:Response,next:NextFunction){
        let data = await req.cookies.token
        if(data){
            jwt.verify(data,process.env.SECRETKEY as string,(err:any,__user:any)=>{
                if(err){
                    res.status(403)
                }
                const dt = jwt.decode(data)
                req.customData = dt;
                next()
            })
        }else{
            res.status(404).json({
                message:"you are not logged in"
            })
        }
    }
    public uploadimg(){

    }
}