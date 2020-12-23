/**
 * Routes to manage file uploads and downloads
 * 
 * All routes are protected
 * 
 * before accessing any routes, the user must have valid token
 * then the token data will be parsed tocheck the authenticity 
 * of user along with the verified tag.
 * 
 * 
 * middlewares: default import from src/api/middlewares/index.ts
 */

 import {NextFunction, Request, response, Response, Router} from 'express';
 import middlewares from '../middlewares/index';
 import multer from 'multer';
 import fileHandlerClass from '../../services/files';
 import Logger from '../../loaders/logger';
 import {celebrate,Joi} from 'celebrate';
 import fs from 'fs';

 const route = Router();


 // may not show intellisense on non imported modules

 /**
  * storage: store files as buffer in the memory and then send
  *     files from buffer to storage
  *  upload : defines the multer configuration, would have handled it 
  *     if needed for disk storage
  */

 const storage = multer.memoryStorage();
 const upload = multer({storage: storage});

 const JoiSchema = {
   fileKeySchema:Joi.string().required().trim(),
   fileIdSchema:Joi.string().required().trim(),
   shareableSchema: Joi.boolean().required()
 }

 export default (app:Router)=>{
     // isAuth and getCurrentUser is used as all the routes here are protected
     app.use('/files', middlewares.isAuth, middlewares.getCurrentUser,middlewares.isVerified, route);

     /**
      * Add files to s3 only if user is valid and verified
      */
     route.post('/add',upload.fields([{maxCount:5,name:'myFiles'}]), middlewares.validateUploads
     ,async (req:Request, res:Response, next:NextFunction)=>{
       try {
          //console.log(req['currentUser']);
          const {_id,storage} = req['currentUser'];
          const fileUploadHandler = new fileHandlerClass();
          const uploadedFileData = await fileUploadHandler.addFiles(req.files,_id,storage);
          //console.log(uploadedFileData);
          res.status(201).json({msg:"Addition Successful",data:uploadedFileData}).end();
       } catch (e) {
         Logger.debug('src/api/routes/files/add');
         Logger.error('%o',e);
         return next(e);
       }
     });


     /**
      * Delete files on s3 only if user is valid and verified
      */
     route.post('/delete', celebrate({
       body:Joi.object().keys({
         fileKey:JoiSchema.fileKeySchema
       })
     })
     ,async(req:Request, res:Response, next:NextFunction)=>{
        try {
          const {fileKey} = req.body;
          const {_id,storage} = req['currentUser'];
          const fileDeleteHandler = new fileHandlerClass();
          await fileDeleteHandler.deleteFiles(fileKey,_id,storage);
          res.status(201).json({msg:"Deletion Successful"}).end();
        } catch (e) {
          Logger.debug('src/api/routes/files/delete');
          Logger.error('%o',e);
          return next(e);
        }
     });


     /**
      * ACL control : Access Control List
      * for making file sharable
      */
    route.post('/shareable', celebrate({
      body:Joi.object().keys({
        fileKey:JoiSchema.fileKeySchema,
        shareable: JoiSchema.shareableSchema
      })
    })
    ,async(req:Request, res:Response, next:NextFunction)=>{
      try {
         const {fileKey, shareable} = req.body;
         const fileShareHandler = new fileHandlerClass();
         const shareURL = await fileShareHandler.toggleShareable(fileKey,shareable);

         res.status(201).json({msg:"Sharable toggle successful", data:shareURL?(shareURL):'Private Access Only'})
      } catch (e) {
        Logger.debug('src/api/routes/files/shareable');
        Logger.error('%o',e);
        return next(e);
      }
    });


    /**
     * Download an object file without ACL:'public-read'
     */

     route.post('/download', celebrate({
      body:Joi.object().keys({
        fileId:JoiSchema.fileIdSchema,
        fileKey:JoiSchema.fileKeySchema,
      })
     })
     ,async (req:Request, res: Response, next:NextFunction) => {
       try {
         const {fileId,fileKey} = req.body;
         const fileDownloadHandler = new fileHandlerClass();
         const fileData = await fileDownloadHandler.download(fileId,fileKey);
         
         if(!fileData){
            throw Error('Unable to download file. Make sure the fileKey is correct');
         }

         res.set({
          'Content-Type': fileData['ContentType'],
          'Content-Length' : fileData['ContentLength']
         })
         res.attachment(fileKey);
         res.send(fileData['Body']);
       } catch (e) {
          Logger.debug('src/api/routes/files/download');
          Logger.error('%o',e);
          return next(e);
       }
     })


     route.get('/allfiles', async(req:Request,res:Response,next:NextFunction)=>{
       try {
          const {_id} = req['currentUser'];
          const fileViewHandler = new fileHandlerClass();
          const files = await fileViewHandler.viewFiles(_id);
          res.status(200).json({message:"File fetched successfully",files});
       } catch (e) {
          Logger.debug('src/api/routes/files/allfiles');
          Logger.error('%o',e);
          return next(e);         
       }
     })
 }