/**
 * Responsible for accumulating all loaders
 * here and then finally sending them where ever
 * they are required
 */

 import expressLoader from './express';
 import mongoLoader from './mongoose';
 import Logger from './logger';

 export default async ({expressApp})=>{

    await mongoLoader();
    Logger.info('✌ Database Loaded');
    await expressLoader({app:expressApp});
    Logger.info('✌ Express Loaded');
 }