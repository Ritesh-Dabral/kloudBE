/**
 * Mail Service
 */

import {IUser} from './IUser';

export interface IMails {
    _id:String,
    uid:IUser['_id'],
    uuid:String
}
