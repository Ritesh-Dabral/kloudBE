/**
 * 
 */

 import {celebrate,Joi} from 'celebrate';
 import {NextFunction, Request, Response, Router} from 'express';
 import Logger from '../../loaders/logger';
 import LocalAuthService from '../../services/localAuth';
 import {IUserInput} from '../../interfaces/IUser';
 import Config from '../../config/index';
 
 const route = Router();

 const JoiSchema = {
   emailSchema:Joi.string().email().required().trim(),

   passwordSchema :Joi.string().required().min(8).max(100),

   usernameSchema:Joi.string().required().trim().min(3).max(100),

   verifMailIdSchema:Joi.string().required(),

   uuidSchema:Joi.string().required(),
 }

 export default async(app:Router)=>{
     
    app.use('/auth', route);

    /**
     * /api/auth/local/signup
     * 
     * body: {
     *  email,password,username
     * }
     */
    route.post('/local/signup', celebrate({
        body: Joi.object().keys({
            email:JoiSchema.emailSchema,
            password:JoiSchema.passwordSchema,
            username:JoiSchema.usernameSchema
        })
    }) ,
        async(req:Request, res:Response, next:NextFunction)=>{
          try {
            let userInput:IUserInput = req.body;
            const localAuthServicesObj = new LocalAuthService();
            const {token,user} = await localAuthServicesObj.SignUp(userInput);
            res.status(201).send({user,token});
          } catch (e) {
            Logger.debug('src/api/routes/localAuth/signup');
            Logger.error('%o',e);
            return next(e);
          }
    });

    /**
     * /api/auth/local/signin
     * 
     * body: {
     *  email,password
     * }
     */

     route.post('/local/signin', celebrate({
       body: Joi.object().keys({
        email:JoiSchema.emailSchema,
        password:JoiSchema.passwordSchema,
       })
      }) ,
        async (req:Request,res:Response, next:NextFunction)=>{
          try {
            let userInput : Partial<IUserInput> = req.body;
            const localAuthServicesObj = new LocalAuthService();
            const {token,user} = await localAuthServicesObj.SignIn(userInput);
            res.status(200).send({token,user});
          } catch (e) {
            Logger.debug('src/api/routes/localAuth/signin');
            Logger.error('%o',e);
            return next(e);
          }
        }
     )



          /**
      * Verify email
      */
     route.get('/verify/:verifMailId/:uuid', celebrate({
        params: Joi.object().keys({
          verifMailId:JoiSchema.verifMailIdSchema,
          uuid:JoiSchema.uuidSchema,
        })
      }),
     async (req:Request,res:Response, next:NextFunction)=>{
       try {

         const {verifMailId,uuid} = req.params;
         const newVerification = new LocalAuthService();
         await newVerification.VerifyEmail(verifMailId,uuid);

         res.redirect(Config.FE_URL_HOMEPAGE);

       } catch (e) {
         Logger.debug('src/api/routes/home/resendverifmail');
         Logger.error('%o',e);
         return next(e);
       }
     })

 }
