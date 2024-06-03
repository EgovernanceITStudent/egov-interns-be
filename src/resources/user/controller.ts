import { Request,Response, Router } from "express";
import { user } from "./model";
import multer from "multer";
import { Middleware } from "../../utils/middleware";

export class User {
    path:string
    router:Router
    constructor(){
        this.path = ''
        this.router = Router()
        this.initializeRoute()
    }
    initializeRoute(){
        const storage = multer.memoryStorage()
        const upload = multer({storage})

        this.router.route('/profile').get(new Middleware().authchecker,this.profile)
        this.router.route('/user/:id').patch(this.updateuser).delete(this.deleteuser)
        this.router.route('/uploadimage').patch(new Middleware().authchecker,upload.single('image'),this.uploadimage)
    }

    public async profile(req:Request,res:Response) {
        const data = req.customData;
        let users = await user.findAll({
            where:{
                uid:data.uid
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
    
    public async uploadimage(req:Request,res:Response){
        let length = 15
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let result = '';
    
        // Loop to create a string of the desired length
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charactersLength);
            result += characters[randomIndex];
        }
    
        const data = req.file
        const datapath = result
        await new Middleware().uploadimg(datapath,data?.buffer)
        const url = process.env.PROJECTURL as string + "/storage/v1/object/public/" + process.env.BUCKETNAME as string + "/" + datapath
        console.log(req.customData.uid)
        const usr:any | null = await user.findOne({
            where:{
                uid:req.customData.uid
            },attributes:['uid','profile_image']
        })
        usr.profile_image = url
        await usr.save()
        res.status(200).json({
            data:data,
            message:"success"
        })
    }
} 