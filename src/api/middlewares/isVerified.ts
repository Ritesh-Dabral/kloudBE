/**
 * Check if the user is verified
 * 
 * We get req['currentUser'] from getCurrentUser middleware
 * so now we use this middle ware to check the verified field 
 * of the user and only grant access if verified property is true
 * 
 */

 import {Request, Response, NextFunction} from 'express';
 import Logger from '../../loaders/logger';

 const isVerified = async (req:Request, res:Response, next:NextFunction)=>{
     try {
        Logger.silly('✅ Verifying User');

        const {verified} = req['currentUser'];
        
        if(!verified){
            throw Error('E403');
        }

        return next();
     } catch (e) {
         Logger.debug('src/api/middlewares/isVerified');
         return next(e);
     }
 }

 export default isVerified;