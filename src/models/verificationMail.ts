/**
 * IUser: User interface
 * User model, implements IUser interface
 */


import mongoose,{Document, Schema} from 'mongoose';
import {IMails} from '../interfaces/IMail';

const MailSchema = new mongoose.Schema(
    {
        uid: {
            type:Schema.Types.ObjectId,
            trim:true,
            unique:true,
            required:[true, 'User id required'],
        },
        uuid:{
            type:String,
            unique:true,
            required:[true,'Unique Verification ID required']
        },
        createdAt:{
            type:Date,
            default:Date.now(),
            expires:'24h'
        }
    }
);

/**
 * Our interface (IFiles) needs to extend Document, 
 * Document: an interface that extends MongooseDocument, 
 *   NodeJS.EventEmitter & ModelProperties. 
 *   This will add the required functions and 
 *   fields to your interface, such as save(), 
 *   remove(), __v, ect...
 */
export const VerifMailModel =  mongoose.model<IMails & Document>('VerifMails',MailSchema);