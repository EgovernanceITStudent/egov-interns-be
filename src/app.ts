import express,{Application, Express,Request,Response} from 'express';
import { Controller } from './interfaces/controllerInterface';

export class App {
    private express:Application;
    controllers:Controller[];
    port:number;

    constructor(controllers:Controller[],port:number){
        this.express = express();
        this.port = port;
        this.controllers = controllers;
        this.initiatializeMiddlewares();
        this.initializeRoute()
    }
    
    private initiatializeMiddlewares(){
        this.express.use(express.json());
    }

    private initializeRoute(){
        this.express.get('/',(req:Request,res:Response)=>{
            res.json({
                message:"welcome to the e-gov intern API"
            })
        });

        this.controllers.forEach(controller=>{
            this.express.use(controller.path, controller.router)
        })
    }

    public listen(){
        this.express.listen(this.port,()=>{
            console.log('listening')
        })
    }
}