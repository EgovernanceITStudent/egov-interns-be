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
        let dt:any = await user.create({...data});
        const payload = {
            uid:dt.uid,
        }
        console.log(payload)
        
        const token = jwt.sign(payload,process.env.SECRETKEY as string,{expiresIn:'24000'})
        res.cookie('token',token).status(200).json(
            {
                message:'success',
                data:data,
                token:token
            }
        );
    }

    public async login (req:Request,res:Response){
        let data = req.body;
        const User = await user.findOne({
            where:{username:data.username},
        attributes:['password','uid','first_name','last_name','email','username','profile_image','github_link','linkdin_link']}
        )
        if(User === null){
            res.status(400).json({
                message:"User name does not exist"
            })
        }
        let userpassword = User?.getDataValue('password');
        const uid = User?.getDataValue('uid');
        console.log(User);
        await bcrypt.compare(data.password,userpassword)
        const payload = {
            uid:uid
        }
        if(bcrypt){
            const token = jwt.sign(payload,process.env.SECRETKEY as string,{expiresIn:'24'})
            res.cookie('token',token).status(200).json({
                message:"success",
                data:User,
                token:token
            });
        }
    }
}