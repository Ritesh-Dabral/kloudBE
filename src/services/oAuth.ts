/**
 * OAuth services
 * 
 */

 import Logger from '../loaders/logger';
 import AllModels from '../models/index';
 import {IUser} from '../interfaces/IUser';
 import {Document,Model} from 'mongoose';
 import Config from '../config/index';
 import jwt from 'jsonwebtoken';



 export default class OAuthServices{
    private UserModel: Model<IUser & Document> = AllModels.UserModel;

    constructor(){}

    public async Access(userProfile){
        try {
            Logger.silly('✅ Google Access Service Called');

            let user = null,UserDBResponse=null;

            UserDBResponse = await this.UserModel.findOne({"email":userProfile['email']});

            if(UserDBResponse && UserDBResponse['userType']!=='OAUTH'){
                throw Error('OAUTH:User already registered with the email. Use email and password authentication or signup with a different email');
            }
            
            if(!UserDBResponse){



                Logger.silly('Creating new OAuth user');

                const newUser={
                    email:userProfile['email'],
                    password:'OAuthUsersDoNotRequirePassword',
                    username:userProfile['username'],
                    profile_image:userProfile['profile_image'],
                    storage:20,
                    userType:'OAUTH',
                    verified:true
                }
                        
                UserDBResponse = await this.UserModel.create(newUser);
            }

    
            Logger.silly('Generating Token');
            const token = await this.GenerateToken(UserDBResponse);
    
            user = UserDBResponse.toObject();
            Reflect.deleteProperty(user,'password');
            
            return {user,token};
        }
        catch (e) {
            Logger.debug('/src/services/oAuth/Access');
            throw(e);
        }
    }


        /**
     * G E N E R A T E   T O K E N
     * 
     * @param UserDBResponse : response received from User db
     */
    public async GenerateToken (UserDBResponse:IUser){
        Logger.silly('✅ Received Token request');
        return jwt.sign({
            iss:'cloudstorage',
            id:UserDBResponse._id
        },Config.jwt.secret,{ expiresIn: '72h', algorithm: "HS256" });
    }
 }