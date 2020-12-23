/**
 * IUser: User interface
 * User model, implements IUser interface
 */


 import mongoose,{Document, Schema} from 'mongoose';
 import {IFiles} from '../interfaces/IFiles';


const FileSchema = new mongoose.Schema(
    {
        uid: {
            type:Schema.Types.ObjectId,
            trim:true,
            required:[true, 'User Id Required'],
        },
        fileKey: {
            trim:true,
            type:String,
            unique:true,
            required:[true, 'File Key Required'],
        },
        url: {
           type:String,
           trim:true,
           unique:true,
           required:[true, 'File URL required'],
        },
        originalname: {
           type:String,
           trim:true,
           required:[true, 'File original name required'],
           validate:[/\.{1}[\w]+$/,'Original name must contain valid extension of file']
        },
        contentType: {
           type:String,
           trim:true,
           required:[true, 'File content type required']
        },
        ACL:{
            type:String,
            default:'private',
            lowercase:true,
            required:[true, 'Access control of file is required']
        },
        size:{
            type:Number,
            required:true,
            min:[0.0000000001, 'File size cannot be less than 0.0000000001 Mb'],
            max:[20, 'File size cannot be more than 20Mb'],
        }
    },{timestamps:true}
);

/**
 * Validating ACL
 */
    FileSchema.path('ACL').validate(function(val){
    
        if(val==='private' || val==='public-read'){
            return true;
        }
        
        return false;
    },`ACL type can be 'private' or 'public-read' only `);

/**
 * Our interface (IFiles) needs to extend Document, 
 * Document: an interface that extends MongooseDocument, 
 *   NodeJS.EventEmitter & ModelProperties. 
 *   This will add the required functions and 
 *   fields to your interface, such as save(), 
 *   remove(), __v, ect...
 */
export const FileModel =  mongoose.model<IFiles & Document>('Files',FileSchema);