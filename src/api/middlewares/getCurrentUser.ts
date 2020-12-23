/**
 * This checks the req['user'] field returend by the 
 * isAuth using express-jwt 
 * Now check the user's existence and send it frwd
 * 
 */

 import {Request,Response,NextFunction} from 'express';
 import Logger from '../../loaders/logger';
 import {UserModel} from '../../models/user';

 const getCurrentUser = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        Logger.silly('✅ Verifying User based on Token');

        Logger.silly('Extracting user id');
        const {id} = req['user'];

        Logger.silly('Checking for user\'s existence');
        const UserDBResponse = await UserModel.findById(id);

        if(!UserDBResponse){
            // 401 : unauthorized access
            return res.sendStatus(401);
        }

        const user = UserDBResponse.toObject();
        Reflect.deleteProperty(user, 'password');

        Logger.silly(`Adding currentUser prop to 'req' `);
        req['currentUser'] = user;

        return next();
    } catch (e) {
        Logger.debug('src/api/middlewares/getCurrentUser');
        return next(e);
    }
 }

 export default getCurrentUser;