/**
 * 
 */

 import {Request, Response, Router} from 'express';
 const route = Router();

 export default (app:Router)=>{
    app.use('/test', route);

    route.get('/', async(req:Request, res:Response)=>{
        res.status(200).send('Welcome to dDrive').end();
    })

    return 'testRoute';
 }