import { Request,Response, Router } from "express";
import { user } from "../user/model";
import { UserInterface } from "src/interfaces/userInterface";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export class Authcontroller {
router:Router;
path:string
constructor(){
    this.router = Router();
    this.path = '';
    this.initRoute();
}
initRoute(){
    this.router.post('/signup',this.signup)
    this.router.post('/login',this.login)
}
    public async signup (req:Request,res:Response){
        let data:UserInterface = req.body;
        if(!data.firstName || !data.lastName || !data.email || !data.username){
            res.status(400).json({
                status:'invalid input name'
            })
        }
        await bcrypt.hash(data.password,10).then(function(hash){
            data.password = hash
        })
        await user.create({...data});
        jwt.sign(data,process.env.SECRETKEY as string,{expiresIn:'24'})
        res.status(200).json(
            {
                message:'success'
            }
        )
    }

    public async login (req:Request,res:Response){
        let data = req.body;
        const User = await user.findOne({
            where:{username:data.username},
        attributes:['password']}
        )
        if(User === null){
            res.status(400).json({
                message:"User name does not exist"
            })
        }
        let userpassword = User?.getDataValue('password')
        await bcrypt.compare(data.password,userpassword)
        if(bcrypt){
            jwt.sign(data,process.env.SECRETKEY as string,{expiresIn:'24'})
            res.status(200).json({
                message:"success"
            })
        }
        res.status(401).json({
            message:"incorrect password or username"
        })
    }
}