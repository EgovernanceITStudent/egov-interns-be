import { Request,Response, Router } from "express";
import { user } from "./model";


export class User {
    path:string
    router:Router
    constructor(){
        this.path = ''
        this.router = Router()
    }
    initializeRoute(){
        this.router.route('/profile/:id').get(this.profile)
        this.router.route('user/:id').patch(this.updateuser).delete(this.deleteuser)
   
    }

    public async profile(req:Request,res:Response) {
        let users = await user.findAll({
            where:{
                uid:req.params.id
            },
            attributes:['first_name','last_name','username','email','linkdin_link','github_link']
        })
        res.status(200).json({
            message:users
        })
    }

    public async deleteuser(req:Request,res:Response) {
        await user.destroy({
            where:{
                uid:req.params.id
            }
        })
        res.status(200).json({
            message:"user has been deleted"
        })
    }

    public async updateuser(req:Request,res:Response) {
        const data = req.body;
        if(data.password || data.uid){
            res.status(401).json({
                message:"you are not allowed update password or id"
            })
        }
        await user.update(data,{
            where:{
                uid:req.params.id
            }
        })
        res.status(200).json({
            message:"success"
        })

    }
} 