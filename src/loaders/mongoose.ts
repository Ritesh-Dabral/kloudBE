/**
 * 
 */

 import mongoose from 'mongoose';
 import config,{loadEnvFile} from '../config/index';
 import {Db} from 'mongodb';


 export default async ():Promise<Db>=>{
    try {
        await loadEnvFile();
        const newConnection = await mongoose.connect(config.mongoDB.URI,
            { 
                useNewUrlParser: true,
                useUnifiedTopology: true, 
                useFindAndModify: false,
                useCreateIndex: true 
            }
        );
        return newConnection.connection.db;
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
 }