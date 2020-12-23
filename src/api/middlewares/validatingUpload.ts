/**
 * 
 * If we reach here, that means multer allowed the files
 * and now we will check their sizes and fields and throw
 * custom errors
 * 
 * Here, we will have access to req.files['myFiles] and req['currentUser']
 * to check whether the addition of these file will exceed user's storage???
 */

 import {NextFunction, Request,Response} from 'express';
 import Logger from '../../loaders/logger';

 const validateUpload = async (req:Request, res:Response, next:NextFunction)=>{

    try {
        
        Logger.silly('✅ Validating Files Before Uploading');

        if(!req.files){
            throw Error('Found No file(s)');
        }

        let sizeInMb:number = 0;
        req.files['myFiles'].forEach(file => {
            sizeInMb = sizeInMb + (file.size/Math.pow(10,6));
        });

        Logger.silly(`${sizeInMb} Mb of data for upload`);
        if(sizeInMb>20){
            throw Error('Overall file size must not exceed 20 Mb');
        }

        Logger.silly('Checking user\'s storage');
        if(req['currentUser'].storage<sizeInMb){
            throw Error('Free up space to add more. Upload exceeing 20 Mb limit');
        }

        return next();
    } catch (e) {
        Logger.debug('src/api/middlewares/validateUpload');
        return next(e);
    }
 }

 export default validateUpload;