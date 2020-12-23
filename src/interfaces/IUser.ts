/**
 * IUser: Interface for DB Storage
 * IUserInput: Interface to get user response
 */

 export interface IUser {
     _id:String,
     email: String;
     password: String;
     username: String;
     profile_image: String;
     storage:number;
     userType:String;
     verified: Boolean;
 }

 export interface IUserInput {
    email: String;
    password: String;
    username: String;
}