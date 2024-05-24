import { Request,Response,Router } from "express";
import { feed } from "./model";
import { Feed } from "src/interfaces/feedinterface";
import { Middleware } from "../../utils/middleware";


export class Feedscontroller{
    path:string
    router:Router;
    constructor(){
        this.router = Router() ;
        this.path = '' ;
        this.initRoute() ;
    }
    initRoute(){
        this.router.route('/feeds').get(new Middleware().authchecker,this.gettingfeeds).post(new Middleware().authchecker,this.postingfeed)
        this.router.route('/feeds/:id').patch(new Middleware().authchecker,this.patchfeed).delete(new Middleware().authchecker,this.deletefeed)
    }

    public async gettingfeeds(req:Request,res:Response){
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const offset = (page - 1) * pageSize;

        const {count,rows} = await feed.findAndCountAll({
            limit: pageSize,
            offset,
            order: [['uid', 'ASC']]
        }) 
        console.log(req.customData)
        res.status(200).json({
            message:{
                message:rows,
                totalfeeds:count,
                payload:req.customData
            }
        })
    }

    public async postingfeed(req:Request,res:Response) {
        const dt = req.customData
        console.log("i am posting feeds")
        req.body.userid = dt.uid;
        const data:Feed = req.body;
        await feed.create({...data});
        res.status(200).json({
            message:"success"
        })
    }

    public async patchfeed(req:Request,res:Response) {
        const id = req.params.id
        const feeds = await feed.findOne({
            where: {
                uid:id
            },
            attributes:['body','userid']
        })
        const authurid = feeds?.getDataValue('userid');
        if(authurid === req.customData.uid){
            const dt = req.body;
            await feed.update({body:dt.body},{
                where:{
                    uid:authurid
                }
            })
            res.status(200).json({
                message:"success"
            })
        }else{
            res.status(401).json({
                message:"user is not allowed to edit this post"
            })
        }
    }

    public async deletefeed(req:Request,res:Response) {
        const id = req.params.id
        await feed.destroy({
            where:{
                uid:id
            }
        })
        res.status(200).json({
            message:"Successfully deleted"
        })
    }
}