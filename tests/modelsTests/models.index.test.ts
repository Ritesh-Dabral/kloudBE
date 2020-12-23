/**
 * Includes all models test
 * 
 */

 import Config from '../../src/config/testIndex';
 import mongoose from 'mongoose';
 import {UserModel} from '../../src/models/user';
 import { UserModelTests } from './models.user.test';
 import { FilesModelTests } from './models.files.test';
 import { VerifMailTests } from './models.verificationMail.test';
 import { FileModel } from '../../src/models/files';
 import { VerifMailModel } from '../../src/models/verificationMail';

describe('✅ MODELS', ()=>{

    /**
     * SETUP A MOCK DB TO CHECK THE WORKING OF 
     * SERVICES (if required)
     * 
     */

    beforeAll( async()=>{
        await mongoose.connect(Config.mongoDB.URI,
            { 
                useNewUrlParser: true,
                useUnifiedTopology: true, 
                useFindAndModify: false,
                useCreateIndex: true 
            }
        );
     });


     describe('✅ USER MODELS',UserModelTests);
     describe('✅ VERIFICATION MAIL  MODELS',VerifMailTests);
     describe('✅ FILES MODELS',FilesModelTests);

     /**
      * CLEAN UP AT THE END
      */
     afterAll(async(done)=>{
        await UserModel.deleteMany({});
        await VerifMailModel.deleteMany({});
        await FileModel.deleteMany({});
        mongoose.disconnect(done)
    })
 })