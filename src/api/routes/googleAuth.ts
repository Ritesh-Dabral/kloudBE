/**
 * Google authentication routes
 * 
 */


 import {Request, Response, NextFunction, Router} from 'express';
 import Config from '../../config/index';
 import OAuthServices from '../../services/oAuth';
 import {UserModel} from '../../models/user';
 import Logger from '../../loaders/logger';
 
 const route = Router();


 export default async(app:Router)=>{
    
    app.use('/auth/google', route);

        //  G O O G L E 

        // route.get("/login", async(req:Request,res:Response,next:NextFunction)=>{
        //     const newOauthUser = new OAuthServices;

        //     res.status(200).json({user,token})
        // });

        //  REDIRECT   FROM   GOOGLE 
    
        route.post('/access',async(req:Request,res:Response,next:NextFunction)=>{
            try {
                const {profile} = req.body;
                const newOauthUser = new OAuthServices;
                const {token,user} = await newOauthUser.Access(profile);
                res.status(201).json({token,user});
            } catch (e) {
                Logger.debug('src/api/routes/googleAuth/access');
                Logger.error('%o',e);
                return next(e);
            }
        });
 }