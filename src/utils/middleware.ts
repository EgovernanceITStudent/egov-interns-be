import { Request,Response,NextFunction } from "express";
import  jwt  from "jsonwebtoken";
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'


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
                const dt:any = jwt.decode(data)
                req.customData = dt;
                next()
            })
        }else{
            res.status(404).json({
                message:"you are not logged in"
            })
        }
    }
    public async checking(req:Request,__res:Response,next:NextFunction){
        const supabase = createClient(process.env.PROJECTURL as string, process.env.PROJECTAPIKEY as string)
        const {data} = await supabase.storage.from(process.env.BUCKETNAME as string).list()
        const imageName:string [] | any = data?.map(file => file.name);
        console.log(req.customData.uid)
        console.log(imageName)
        let pic:boolean = false
        for(let i =0 ; i< imageName.length; i++){
            if(imageName[i] === req.customData.uid){
                pic = true;
            }
        }

        if(pic === true){
            await supabase.storage.from(process.env.BUCKETNAME as string).remove([req.customData.uid])
            next()
        }else{
            next()
        }
    }


    public async uploadimg(file_path:string,file:any){
        const supabase = createClient(process.env.PROJECTURL as string, process.env.PROJECTAPIKEY as string)
        const { data, error } = await supabase.storage.from(process.env.BUCKETNAME as string).upload(file_path,file,{
            contentType:'image/jpeg'
        })
        if (error) {
            return error
        } else {
            return data
        }
    }
}