import { Request,Response, Router } from "express";
import { user } from "../user/model";
import { UserInterface } from "src/interfaces/userInterface";
import bcrypt from 'bcrypt'

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
        // const datum = await user.create(data);
        res.status(200).json(
            {
                data:"datam",
                message:'success'
            }
        )
    }
}