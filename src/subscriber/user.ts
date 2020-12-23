/**
 * EVENT HANDLER
 * 
 * subscribing to events and then working on them asynchronously
 */

 import events from 'events';
 import Logger from '../loaders/logger';


 export const userEvent = new events.EventEmitter();

/**
 * User Sign Up Event
 */
 userEvent.on('userSignUp', async (data:string)=>{
    Logger.silly('User Signup called'+data)
 });

