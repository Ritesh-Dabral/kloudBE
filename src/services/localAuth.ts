/**
 * Class which contains all functionalities of local auth
 * 
 * bcrypt: for hashing passwords
 * UserModel: User Model present in src/models/user.ts
 * 
 * JWT is set to expire after 60s 
 */

 import {Document, Model} from 'mongoose';
 import {IUser, IUserInput} from '../interfaces/IUser';
 import {IMails} from '../interfaces/IMail';
 import Logger from '../loaders/logger';
 import bcrypt from 'bcrypt';
 import AllModels from '../models/index';
 import jwt from 'jsonwebtoken';
 import Config from '../config/index';
 import {userEvent} from '../subscriber/user';
 import Mailer from './mailer';
 import { v4 as uuid } from 'uuid';



 export default class LocalAuthentication {

    private UserModel: Model<IUser & Document> = AllModels.UserModel;
    private VerifMailModel: Model<IMails & Document> = AllModels.VerifMailModel;
    private userEvent = userEvent;

    constructor(){}

    /**
     * S I G N   U P
     * 
     * @param userInput : email,pass,username
     * 
     * @todo sign up email is left
     */
    public async SignUp (userInput:IUserInput){
        try {
            Logger.silly('✅ SignUp service called');

            if(userInput['password']==='' || userInput['password'].length<8){
                throw Error(`Password cannot be less than 8 characters`);
            }

            Logger.silly('Generating Salts');
            const salt = await bcrypt.genSalt();

            Logger.silly('Encrypting Password');
            userInput.password = await bcrypt.hash(userInput.password,salt);
            
            let newUserData = {
                ...userInput,
                profile_image:'',
                storage:20,
                userType:'LOCAL',
                verified: false
            }

            Logger.silly('Creating New User');
            let UserDBResponse = await this.UserModel.create(newUserData);
            
            Logger.silly('Sending Welcome Mail');
            await this.userEvent.emit('userSignUp', 'New User Will Be Created');
            
            Logger.silly('Generating Token');
            const token = await this.GenerateToken(UserDBResponse);

            if(!UserDBResponse){
                throw Error('Unable to SignUp');
            }

            Logger.silly('Sending Verification Email');
            await this.GenerateVerificationMail(UserDBResponse._id,UserDBResponse.email);

            const user = UserDBResponse.toObject();
            Reflect.deleteProperty(user,'password');
            Reflect.deleteProperty(user,'verified');

            return {
                token,
                user
            };
        } catch (e) {
            Logger.debug('/src/services/localAuth/signup');
            throw(e);
        }
    }


    /**
     * S I G N   I N
     * 
     * @param userInput: email,password 
     */

    public async SignIn(userInput: Partial<IUserInput>){
        try {
            Logger.silly('✅ SignIn service called');

            Logger.silly('Checking user\'s existence');
            const UserDBResponse = await this.UserModel.findOne({"email":userInput.email});

            if(!UserDBResponse){
                throw Error('User Doesn\'t Exist');
            }

            Logger.silly('Matching Password');
            const passMatch = await bcrypt.compare(userInput.password,UserDBResponse.password.toString());

            if(!passMatch){
                throw Error('Incorrect Password');
            }

            Logger.silly('Generating Token');
            const token = await this.GenerateToken(UserDBResponse);

            const user = UserDBResponse.toObject();
            Reflect.deleteProperty(user,'password');
            Reflect.deleteProperty(user,'createdAt');
            Reflect.deleteProperty(user,'updatedAt');
            Reflect.deleteProperty(user,'_id');
            Reflect.deleteProperty(user,'__v');

            return {
                token,
                user
            };

        } catch (e) {
            Logger.debug('/src/services/localAuth/signin');
            throw(e);            
        }
    }

    
    /**
     * G E N E R A T E   T O K E N
     * 
     * @param UserDBResponse : response received from User db
     */
    private async GenerateToken (UserDBResponse:IUser){
        Logger.silly('✅ Received Token request');
        return jwt.sign({
            iss:'cloudstorage',
            id:UserDBResponse._id
        },Config.jwt.secret,{ expiresIn: '72h', algorithm: "HS256" });
    }


    /**
     * C R E A T E   N E W   V E R I F I C A T I O N
     * 
     * @param userId : user document id
     * @param email : user email
     */
     public async GenerateVerificationMail(userId,email){
        try {
            Logger.silly('✅ Generate New Verification Mail');

            Logger.silly('Creating/Updating Verification Req');
            const verificationId = uuid();
    
            let newMailReq;

            newMailReq = await this.VerifMailModel.findOne({"uid":userId});

            console.log(newMailReq);

            if(newMailReq){
                throw Error(`Verification link has already been sent. Check your registered email address.`+
                    `You can apply for new mail only after 24 hrs from the time of last application`
                )
            }
    
            newMailReq = await this.VerifMailModel.create({"uid":userId,"uuid":verificationId});
            
            if(!newMailReq){
                throw Error('Unable to create/update verification link');
            }
    
            Logger.silly('Generating New verification URL');
            const verificationURL = `${Config.URL_prefix}/auth/verify/${newMailReq._id}/${verificationId}`;
    
            if(process.env.NODE_ENV!=='test'){
                Mailer.sendVerifyMail(email,verificationURL);
            }

        } catch (e) {
            Logger.debug('/src/services/localAuth/GenerateVerificationMail');
            throw(e);   
        }
     }


     /**
      * Verify email based on the params
      * 
      * @param verifMailId 
      * @param uuid 
      */
     public async VerifyEmail(verifMailId:string, uuid:string){
        try {
            Logger.silly('✅ Verify Email Service Called');

            Logger.silly('Verifying link');
            const verifMail = await this.VerifMailModel.findOne({
                "_id":verifMailId,
                "uuid":uuid
            });

            if(!verifMailId){
                throw Error('Unable to verify user');
            }

            Logger.silly('User verified, updating database');

            const UserDBResponse = await this.UserModel.findOneAndUpdate({
                "_id":verifMail.uid
            },{verified:true})

            if(!UserDBResponse){
                throw Error('Error Updating User');
            }

            return;
            
        } catch (e) {
            Logger.debug('/src/services/localAuth/VerifyEmail');
            throw(e);   
        }
     }
 }