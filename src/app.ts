/**
 * 
 */

 import express from 'express';
 import Logger from './loaders/logger';
 import Config from './config/index';

 async function startServer() {
     // set this app const from express module
     const app = express();

     // now send the 'app' to the index.ts from Loader
     await require('./loaders').default({expressApp:app});

     // finally start the server

     app.listen(Config.PORT, ()=>{
        Logger.info(`
        ################################################
            ✔️  Server listening on port: ${Config.PORT} ✔️
        ################################################
        `)
     });
 }

 startServer();

