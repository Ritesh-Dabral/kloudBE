/**
 * Includes all services tests
 * 
 */

 import { FilesTests } from "./services.files.test";
 import { AuthTests } from "./services.localauth.test";
 import Config from '../../src/config/testIndex';
 import mongoose from 'mongoose';
 import {UserModel} from '../../src/models/user';
 import {VerifMailModel} from '../../src/models/verificationMail';
 import {FileModel} from '../../src/models/files';


 describe('✅ SERVICES TEST', ()=>{

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

    describe('✅ LOCAL AUTH SERVICES', AuthTests);
    describe('✅ FILES SERVICES', FilesTests);

        /**
      * CLEAN UP AT THE END
      */
     afterAll(async(done)=>{
      await UserModel.deleteMany({});
      await VerifMailModel.deleteMany({});
      await FileModel.deleteMany({});
      mongoose.disconnect(done)
  })
 });