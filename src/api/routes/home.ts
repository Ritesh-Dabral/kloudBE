/**
 * Route to show homepage
 */

import {Request, Response, NextFunction,Router} from 'express';
import Logger from '../../loaders/logger';
import middlewares from '../middlewares/index';
import LocalAuthService from '../../services/localAuth';

const route = Router();


export default (app:Router)=>{
    app.use('/home', middlewares.isAuth, middlewares.getCurrentUser, route);

    /**
     * Send the storage detail of user
     */
    route.get('/storagedet',async(req:Request,res:Response,next:NextFunction)=>{
        try {
          const {storage} = req['currentUser'];
          res.status(200).json({message:"Storage fetched successfully",storage});
      } catch (e) {
          Logger.debug('src/api/routes/home/storagedet');
          Logger.error('%o',e);
          return next(e);         
      }
     })


         /**
     * Send the storage detail of user
     */
    route.get('/profile',async(req:Request,res:Response,next:NextFunction)=>{
        try {
          const {verified} = req['currentUser'];
          res.status(200).json({
            message:"Data fetched successfully",
            verified
          });
      } catch (e) {
          Logger.debug('src/api/routes/home/profile');
          Logger.error('%o',e);
          return next(e);         
      }
    })


     /**
      * Send verification mail
      */
     route.post('/resendverifmail', 
     async (req:Request,res:Response, next:NextFunction)=>{
       try {

         const {_id,email,verified} = req['currentUser'];

         if(verified){
            res.status(200).json({message:'User Already Verified. Login again to show the changes'});
         }
         else{
          const newVerificationReq = new LocalAuthService();
          await newVerificationReq.GenerateVerificationMail(_id,email);
          res.status(201).json({message:'Verification Mail Sent. Check your registered email (spam as well).Sender: noreplykloudstorage@gmail.com'});
         }

       } catch (e) {
         Logger.debug('src/api/routes/home/resendverifmail');
         Logger.error('%o',e);
         return next(e);
       }
     })

}