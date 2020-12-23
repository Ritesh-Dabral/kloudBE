/**
 * IUser: User interface
 * User model, implements IUser interface
 */

 import mongoose,{Document} from 'mongoose';
 import {IUser} from '../interfaces/IUser';
 import {isEmail} from 'validator';

 const UserSchema = new mongoose.Schema(
     {
         email: {
             type:String,
             lowercase:true,
             trim:true,
             required:[true, 'Please enter your email address'],
             validate:[isEmail,'Not a valid email'],
             unique:true
         },
         password: {
            type:String,
            required:[true, 'Please enter your password'],
            minlength:[8, 'Passwords >= 8 characters'],
         },
         username: {
            type:String,
            trim:true,
            required:[true, 'Please enter a username'],
            minlength:[3, 'Username >= 3 characters'],
            maxlength:[200, 'Username <= 200 characters']
         },
         profile_image: {
            type:String,
            trim:true,
            default:'',
         },
         storage:{
            type:Number,
            default:20,
            min:[0, 'Storage cannot be negative'],
            max:[20, 'Storage cannot be more than 20Mb']
         },
         userType:{
            type:String,
            default:'LOCAL',
            uppercase:true,
            required:[true,'User type required']
         },
         verified: {
            type:Boolean,
            default:false
         }
     },{timestamps:true}
 );


 /**
  * V A L I D A T O R
  */

 UserSchema.path('userType').validate(val=>{
    if(val.toUpperCase()==='LOCAL' || val.toUpperCase()==='OAUTH'){
       return true;
    }
    return false;
 },`UserType can only be 'LOCAL' or 'OAUTH'`)

 /**
  * Our interface (IUser) needs to extend Document, 
  * Document: an interface that extends MongooseDocument, 
  *   NodeJS.EventEmitter & ModelProperties. 
  *   This will add the required functions and 
  *   fields to your interface, such as save(), 
  *   remove(), __v, ect...
  */
 export const UserModel =  mongoose.model<IUser & Document>('User',UserSchema);