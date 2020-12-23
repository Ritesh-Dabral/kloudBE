/**
 * IFiles: Interface for file meta data Storage
 * 
 */


 import {IUser} from './IUser';

export interface IFiles {
    _id:String,
    uid:IUser['_id'],
    fileKey: String;
    url: String;
    originalname: String;
    contentType: String;
    ACL: String;
    size:number;
}
